import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { GroupMember } from './entities/group-member.entity';

@Controller('group-member')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  async create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMemberService.create(createGroupMemberDto);
  }

  @Get('/get-by-group/:group_id')
  async findByGroup(@Param('group_id') group_id:number):Promise<GroupMember[]> {
    return this.groupMemberService.findByGroup(group_id);
  }

  @Delete('/delete?')
  remove(@Query('group') group:number,@Query('user') user:number,) {
    return this.groupMemberService.remove(+group,+user);
  }
}
