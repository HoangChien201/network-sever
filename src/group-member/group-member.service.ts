import { Injectable } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupMemberService {

  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMember: Repository<GroupMember>
  ) { }

  async create(createGroupMemberDto: CreateGroupMemberDto): Promise<any> {
    try {
      return await this.groupMember.save(createGroupMemberDto)
    } catch (error) {
      return {
        status:-1,
        message:error
      }
    }
    
  }

  async findByGroup(group_id: number): Promise<GroupMember[]> {
    return await this.groupMember
      .createQueryBuilder('gm')
      .leftJoin('gm.user', 'user')
      .addSelect(['user.id', 'user.fullname', 'user.avatar'])
      .where({
        group: group_id
      })
      .getMany();
  }

  async remove(group_id: number, user_id: number) {
    try {
      await this.groupMember.delete({
        group: group_id,
        user: user_id
      })
      return {
        status: 1,
        message: "Delete Success"
      };
    } catch (error) {
      return {
        status: 1,
        message: "Delete Failed" + error
      };
    }
  }
}
