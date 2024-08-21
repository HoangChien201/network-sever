import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { LikeCommentService } from './like-comment.service';
import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
import { UpdateLikeCommentDto } from './dto/update-like-comment.dto';
import { LikeComment } from './entities/like-comment.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('like-comment')
export class LikeCommentController {
  constructor(private readonly likeCommentService: LikeCommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createLikeCommentDto: CreateLikeCommentDto,@Req() req:Request) {
    return this.likeCommentService.create(createLikeCommentDto,req);
  }

  @Get('get-likes')
  @UseGuards(AuthGuard)
  async findAll():Promise<LikeComment[]> {
    return this.likeCommentService.findAll();
  }

  @Get('get-by-user/:id')
  @UseGuards(AuthGuard)
  async findByUser(@Param('id') id:number):Promise<LikeComment[]> {
    return this.likeCommentService.findByUser(+id);
  }

  @Get('get-by-comment/:id')
  @UseGuards(AuthGuard)
  async findByComment(@Param('id') id:number):Promise<LikeComment[]> {
    return this.likeCommentService.findByComment(+id);
  }

  @Patch('update?')
  @UseGuards(AuthGuard)
  async update(@Query('comment_id') comment_id:number,@Query('user_id') user_id:number, @Body() updateLikeCommentDto: UpdateLikeCommentDto) {
    return this.likeCommentService.update(+comment_id,+user_id, updateLikeCommentDto);
  }

  @Delete('delete?')
  @UseGuards(AuthGuard)
  async remove(@Query('comment_id') comment_id:number,@Query('user_id') user_id:number) {
    return this.likeCommentService.remove(comment_id,user_id);
  }
}
