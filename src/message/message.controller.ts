import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('/get-by-group/:id')
  async findByGroup(@Param('id') id:number) {
    return this.messageService.findByGroup(+id);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
