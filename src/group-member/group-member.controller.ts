import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GroupMemberService } from './group-member.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { GroupMember } from './entities/group-member.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('group-member')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMemberService.create(createGroupMemberDto);
  }

  @Get('/get-by-group/:group_id')
  @UseGuards(AuthGuard)
  async findByGroup(@Param('group_id') group_id:number):Promise<GroupMember[]> {
    return this.groupMemberService.findByGroup(group_id);
  }

  @Delete('/delete?')
  @UseGuards(AuthGuard)
  remove(@Query('group') group:number,@Query('user') user:number,) {
    return this.groupMemberService.remove(+group,+user);
  }
}
