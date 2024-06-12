import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { LikePostsService } from './like-posts.service';
import { CreateLikePostDto } from './dto/create-like-post.dto';
import { UpdateLikePostDto } from './dto/update-like-post.dto';
import { LikePost } from './entities/like-post.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('like-posts')
export class LikePostsController {
  constructor(private readonly likePostsService: LikePostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createLikePostDto: CreateLikePostDto,@Req() req:Request) {
    return this.likePostsService.create(createLikePostDto,req);
  }

  @Get('get-likes')
  async findAll():Promise<LikePost[]> {
    return this.likePostsService.findAll();
  }

  @Get('get-by-user/:id')
  async findByUser(@Param('id') id:number):Promise<LikePost[]> {
    return this.likePostsService.findByUser(+id);
  }

  @Get('get-by-posts/:id')
  async findByPosts(@Param('id') id:number):Promise<LikePost[]> {
    return this.likePostsService.findByPosts(+id);
  }

  @Patch('update?')
  async update(@Query('posts_id') posts_id:number,@Query('user_id') user_id:number, @Body() updateLikePostDto: UpdateLikePostDto) {
    return this.likePostsService.update(+posts_id,+user_id, updateLikePostDto);
  }

  @Delete('delete?')
  async remove(@Query('posts_id') posts_id:number,@Query('user_id') user_id:number) {
    return this.likePostsService.remove(posts_id,user_id);
  }
}
