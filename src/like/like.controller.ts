import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  
  @Delete('/delete?')
  remove(@Query('posts_id') posts_id: number,@Query('user_id') user_id:number) {
    return this.likeService.remove(+posts_id,+user_id);
  }
}
