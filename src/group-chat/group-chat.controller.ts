import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto';
import { GroupChat } from './entities/group-chat.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('group-chat')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post()
  create(@Body() createGroupChatDto: CreateGroupChatDto) {
    return this.groupChatService.create(createGroupChatDto);
  }

  @Get('/get-by-user')
  @UseGuards(AuthGuard)
  async findByUser(@Req() req:Request):Promise<any> {
    return this.groupChatService.findByUser(req);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateGroupChatDto: UpdateGroupChatDto) {
    return this.groupChatService.update(+id, updateGroupChatDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return this.groupChatService.remove(+id);
  }
}
