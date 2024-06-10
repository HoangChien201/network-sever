import { Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private readonly groupRepository: Repository<GroupChat>
  ) { }

  async create(createGroupChatDto: CreateGroupChatDto) {
    if(!createGroupChatDto.image){
      createGroupChatDto.image="http://res.cloudinary.com/delivery-food/image/upload/v1717925637/oqbqmqtswalnlfrmhayn.png"
    }
    return await this.groupRepository.save(createGroupChatDto);
  }

  async findByUser(req: Request) {
    const user_req = req.headers[USER_ID_HEADER_NAME]

    const groups = await this.groupRepository
      .createQueryBuilder('g')
      .innerJoin('g.members', 'member')
      .addSelect('member.user')
      .innerJoin('member.user', 'user')
      .addSelect(['user.id', 'user.fullname', 'user.avatar'])
      .where(`g.id IN (SELECT gc.id FROM networkdb.group_chat gc 
      left join networkdb.group_member gm on gm.group = gc.id where gm.user = ${user_req})`)
      .getMany()

    groups.map(group => {
      //trả về members không phải là người gửi yêu cầu
      if (group.type === 'single') {

        const membersFilter = group.members.filter(m => {
          return m['user']['id'] !== user_req
        })

        group.members = membersFilter;
        group.image = membersFilter[0].user['avatar']

        return group
      }
      return group
    })

    return groups;
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
      await this.groupRepository.delete({id:id})
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
