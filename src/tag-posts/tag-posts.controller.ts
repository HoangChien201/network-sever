import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagPostsService } from './tag-posts.service';
import { CreateTagPostDto } from './dto/create-tag-post.dto';
import { UpdateTagPostDto } from './dto/update-tag-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tag-posts')
export class TagPostsController {
  constructor(private readonly tagPostsService: TagPostsService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTagPostDto: CreateTagPostDto) {
    return this.tagPostsService.create(createTagPostDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.tagPostsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.tagPostsService.findOne(+id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateTagPostDto: UpdateTagPostDto) {
    return this.tagPostsService.update(+id, updateTagPostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.tagPostsService.remove(+id);
  }
}
