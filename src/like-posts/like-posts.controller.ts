import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikePostsService } from './like-posts.service';
import { CreateLikePostDto } from './dto/create-like-post.dto';
import { UpdateLikePostDto } from './dto/update-like-post.dto';

@Controller('like-posts')
export class LikePostsController {
  constructor(private readonly likePostsService: LikePostsService) {}

  @Post()
  create(@Body() createLikePostDto: CreateLikePostDto) {
    return this.likePostsService.create(createLikePostDto);
  }

  @Get()
  findAll() {
    return this.likePostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likePostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikePostDto: UpdateLikePostDto) {
    return this.likePostsService.update(+id, updateLikePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likePostsService.remove(+id);
  }
}
