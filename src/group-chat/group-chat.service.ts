import { Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private readonly groupRepository: Repository<GroupChat>
  ) { }

  async create(createGroupChatDto: CreateGroupChatDto) {
    if (!createGroupChatDto.image) {
      createGroupChatDto.image = "http://res.cloudinary.com/delivery-food/image/upload/v1717925637/oqbqmqtswalnlfrmhayn.png"
    }
    return await this.groupRepository.save(createGroupChatDto);
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
        .leftJoin('m.sender', 'sender')
        .addSelect(['sender.id', 'sender.fullname', 'sender.avatar'])
        .leftJoin('m.reactions', 'reactions')
        .addSelect('reactions.reaction')
        //người đã đọc tin nhắn
        .leftJoinAndSelect('m.reads', 'read')
        .leftJoin('read.user', 'user')
        .addSelect(['user.avatar', 'user.fullname', 'user.id'])
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
      const group = await this.groupRepository.findOne({ where: { id: id } })
      await this.groupRepository.save({
        ...group,
        ...updateGroupChatDto
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
}
