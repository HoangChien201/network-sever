import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessageReadService } from './message-read.service';
import { CreateMessageReadDto } from './dto/create-message-read.dto';
import { UpdateMessageReadDto } from './dto/update-message-read.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageRead } from './entities/message-read.entity';

@Controller('message-read')
export class MessageReadController {
  constructor(private readonly messageReadService: MessageReadService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createMessageReadDto: CreateMessageReadDto,@Req() req:Request):Promise<MessageRead> {
    return await this.messageReadService.create(createMessageReadDto,req);
  }

  @Get()
  findAll() {
    return this.messageReadService.findAll();
  }

  
}
