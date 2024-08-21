import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, Put } from '@nestjs/common';
import { LikeMessageService } from './like-message.service';
import { CreateLikeMessageDto } from './dto/create-like-message.dto';
import { UpdateLikeMessageDto } from './dto/update-like-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('like-message')
export class LikeMessageController {
  constructor(private readonly likeMessageService: LikeMessageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createLikeMessageDto: CreateLikeMessageDto,@Req() req:Request) {
    return this.likeMessageService.create(createLikeMessageDto,req);
  }

  @Get('/get-by-message/:id')
  @UseGuards(AuthGuard)
  findByMessage(@Param('id') message_id: string) {
    return this.likeMessageService.findByMessage(+message_id);
  }

  @Put('/update/')
  @UseGuards(AuthGuard)
  update(@Req() req:Request, @Body() updateLikeMessageDto: UpdateLikeMessageDto) {
    return this.likeMessageService.update(req, updateLikeMessageDto);
  }

  @Delete('/delete?')
  @UseGuards(AuthGuard)
  remove(@Query('message_id') message_id:string,@Query('user_id') user_id:number,@Req() req:Request) {
    return this.likeMessageService.remove(message_id,+user_id,req);
  }
}
