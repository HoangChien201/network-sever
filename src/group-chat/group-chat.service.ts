import { Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { Message } from 'src/message/entities/message.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private readonly groupRepository: Repository<GroupChat>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>
  ) { }

  async create(createDto: CreateGroupChatDto) {
    try {
      const groupExist = await this.CheckGroupExist(createDto)
      if (groupExist && createDto.type === 'single') {
        return groupExist
      }

      return await this.CreateGroup(createDto)


    } catch (error) {
      console.log('error', error);

    }
  }

  async findByUser(req: Request) {
    try {
      const user_req = req.headers[USER_ID_HEADER_NAME]
      const groups = await this.groupRepository
        .createQueryBuilder('g')
        .innerJoin('g.members', 'member')
        .addSelect('member.user')

        //member
        .innerJoin('member.user', 'user')
        .addSelect(['user.id', 'user.fullname', 'user.avatar'])

        //message
        .innerJoinAndSelect('g.messages', 'm')
        .leftJoin('m.group', 'gm')
        .addSelect('gm.id')

        .leftJoin('m.parent', 'p')
        .addSelect(['p.id'])
        .leftJoin('p.sender', 'p_sender')
        .addSelect(['p_sender.id', 'p_sender.fullname', 'p_sender.avatar'])

        .leftJoin('m.sender', 'sender')
        .addSelect(['sender.id', 'sender.fullname', 'sender.avatar'])

        .leftJoin('m.reactions', 'reactions')
        .addSelect(['reactions.reaction', 'reactions.id', 'reactions.user'])
        //người đã đọc tin nhắn
        .leftJoinAndSelect('m.reads', 'read')
        .leftJoin('read.user', 'user-read')
        .addSelect(['user-read.avatar', 'user-read.fullname', 'user-read.id'])
        .orderBy('m.create_at', 'DESC')



        .where(`g.id IN (SELECT gc.id FROM group_chat gc 
      left join group_member gm on gm.group = gc.id where gm.user = ${user_req})`)
        .getMany()
      return groups;
    } catch (error) {
      return {
        status: -1,
        message: 'Failed ' + error
      }
    }

  }

  async update(id: number, updateGroupChatDto: UpdateGroupChatDto) {
    try {
      const { members, ...updateGroup } = updateGroupChatDto

      const group = await this.groupRepository.findOne({ where: { id: id } })
      await this.groupRepository.save({
        ...group,
        ...updateGroup
      })
      return {
        status: 1,
        message: "Update Success"
      };
    } catch (error) {
      return {
        status: 1,
        message: "Update Fail " + error
      };
    }
  }

  async remove(id: number) {
    try {
      await this.groupRepository.delete({ id: id })
      return {
        status: 1,
        message: "Delete Success"
      };
    } catch (error) {
      return {
        status: 1,
        message: "Delete Fail " + error
      };
    }
  }

  private async CreateGroup(createDto: CreateGroupChatDto) {
    const { members, ...createGroup } = createDto

    if (!createGroup.image) {
      createGroup.image = "http://res.cloudinary.com/delivery-food/image/upload/v1717925637/oqbqmqtswalnlfrmhayn.png"
    }
    const groupSave = await this.groupRepository.save(createGroup);
    
    if (members) {
      const memberne=await this.groupMemberRepository.createQueryBuilder()
      .insert()
      .into(GroupMember)
      .values([
        ...members.map((m) => {
          return {
            user: m,
            group: groupSave.id
          }
        })
      ])
      .execute()
      
    }

    const group_respone= await this.groupRepository.createQueryBuilder('g')

      .leftJoin('g.members', 'member')
      .addSelect('member.user')

      //member
      .leftJoin('member.user', 'user')
      .addSelect(['user.id', 'user.fullname', 'user.avatar'])

      .where(`g.id = ${groupSave.id}`)
      .getOne()
      return group_respone;
      
  }

  private async CheckGroupExist(createDto: CreateGroupChatDto): Promise<any> {
    const { members, type } = createDto
    try {
      const group = await this.groupRepository.createQueryBuilder('gc')
        .leftJoin('gc.members', 'member')
        .addSelect('COUNT(member.user)', 'member_count')
        .where(`
     member.user in (:...ids) and gc.type = '${type}'`, { ids: members })
        .groupBy('gc.id')
        .having(`COUNT(member.user) = (select count(gm2.group) from group_member gm2 where gm2.group = gc.id);`)
        .getOne()

      return group
    } catch (error) {
      return {
        status: -1,
        message: '' + error
      }
    }

  }
}
