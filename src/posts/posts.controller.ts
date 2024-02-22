import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto):Promise<Posts> {
    return this.postsService.create(createPostDto);
  }

  @Get('/get-by-user/:user_id')
  findByUser(@Param('user_id') user_id:number):Promise<Posts[]> {
    return this.postsService.findByUser(+user_id);
  }

  @Get('/get-all')
  findAll():Promise<Posts[]> {
    return this.postsService.findAll();
  }

  @Get('/find-one/:id')
  findOne(@Param('id') id: number):Promise<Posts> {
    return this.postsService.findOne(+id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }

  @Get('/get/browse-posts')
  async findBrowsePosts(): Promise<Posts[]> {
    return await this.postsService.findBrowsePosts()
  }

  @Get('/browse-reject-posts/:id')
  async BrowseRejectPosts(@Param('id') id:number): Promise<string> {
    return await this.postsService.BrowseRejectPosts(id)
   
  }

  @Get('/browse-acceptance-posts/:id')
  async BrowseAcceptancePosts(@Param('id') id:number): Promise<string> {
    return await this.postsService.BrowseAcceptancePosts(id)

  }
}
