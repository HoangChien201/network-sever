import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto):Promise<Comment> {
    return this.commentService.create(createCommentDto);
  }

  @Get('/get-by-posts/:posts_id')
  findAllByPosts(@Param() posts_id:number) {
    return this.commentService.findByPosts(posts_id);
  }

  @Delete('/delete?')
  remove(@Query('posts_id') posts_id: number,@Query('user_id') user_id:number) {
    return this.commentService.remove(+posts_id,+user_id);
  }
}
