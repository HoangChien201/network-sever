import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/posts.entity';
import { AuthGuard } from 'src/auth/auth.guard';

export type bodyGetByUser={
  permission:number;
  user_id:number
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPostDto: CreatePostDto,@Req() req:Request):Promise<CreatePostDto> {
    return this.postsService.create(createPostDto,req);
  }

  @Get('/get-by-user/:id')
  @UseGuards(AuthGuard)
  findByUser(@Param('id') id:number,@Req() req:Request):Promise<Posts[] | string> {
    return this.postsService.findByUser(req,id);
  }

  @Get('/get-by-user-request')
  @UseGuards(AuthGuard)
  findByUserRequest(@Req() req:Request):Promise<Posts[]> {
    return this.postsService.findByUserRequest(req);
  }

  @Get('/get-share/:posts_id')
  @UseGuards(AuthGuard)
  findShare(@Param('posts_id') posts_id:number,@Req() req:Request):Promise<Posts[]> {
    return this.postsService.findShare(+posts_id,req);
  }

  @Get('/get-all')
  @UseGuards(AuthGuard)
  findAll(@Req() req):Promise<Posts[]> {
    return this.postsService.findAll(req);
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number,@Req() req):Promise<Posts> {
    return this.postsService.findOne(+id,req);
  }

  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }
}
