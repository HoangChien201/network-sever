import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagPostsService } from './tag-posts.service';
import { CreateTagPostDto } from './dto/create-tag-post.dto';
import { UpdateTagPostDto } from './dto/update-tag-post.dto';

@Controller('tag-posts')
export class TagPostsController {
  constructor(private readonly tagPostsService: TagPostsService) {}

  @Post()
  create(@Body() createTagPostDto: CreateTagPostDto) {
    return this.tagPostsService.create(createTagPostDto);
  }

  @Get()
  findAll() {
    return this.tagPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagPostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagPostDto: UpdateTagPostDto) {
    return this.tagPostsService.update(+id, updateTagPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagPostsService.remove(+id);
  }
}
