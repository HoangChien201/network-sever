import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCommentDto: CreateCommentDto,@Req() req):Promise<Comment> {
    return this.commentService.create(createCommentDto,req);
  }

  @Get('/get-by-posts/:posts_id')
  @UseGuards(AuthGuard)
  findAllByPosts(@Param('posts_id') posts_id:number,@Req() req:Request):Promise<Comment[]> {
    return this.commentService.findByPosts(posts_id,req);
  }

  @Get('/get-by-comment/:comment_id')
  @UseGuards(AuthGuard)
  findAllByCommentParant(@Param('comment_id') comment_id:number,@Req() req:Request):Promise<Comment[]> {
    return this.commentService.findByCommentParent(comment_id,req);
  }

  @Put('/update/:id')
  udpate(@Param('id') id:number,updateCommentDto:UpdateCommentDto) {
    return this.commentService.update(+id,updateCommentDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id:number) {
    return this.commentService.remove(+id);
  }
}
