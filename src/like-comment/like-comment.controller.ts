import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LikeCommentService } from './like-comment.service';
import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
import { UpdateLikeCommentDto } from './dto/update-like-comment.dto';

@Controller('like-comment')
export class LikeCommentController {
  constructor(private readonly likeCommentService: LikeCommentService) {}

  @Post()
  create(@Body() createLikeCommentDto: CreateLikeCommentDto) {
    return this.likeCommentService.create(createLikeCommentDto);
  }

  @Get()
  findAll() {
    return this.likeCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likeCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeCommentDto: UpdateLikeCommentDto) {
    return this.likeCommentService.update(+id, updateLikeCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeCommentService.remove(+id);
  }
}
