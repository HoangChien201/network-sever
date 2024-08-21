import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('/get-by-group/:id')
  @UseGuards(AuthGuard)
  async findByGroup(@Param('id') id:number) {
    return this.messageService.findByGroup(+id);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
