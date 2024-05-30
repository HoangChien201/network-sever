import { Injectable } from '@nestjs/common';
import { CreateTagPostDto } from './dto/create-tag-post.dto';
import { UpdateTagPostDto } from './dto/update-tag-post.dto';

@Injectable()
export class TagPostsService {
  create(createTagPostDto: CreateTagPostDto) {
    return 'This action adds a new tagPost';
  }

  findAll() {
    return `This action returns all tagPosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tagPost`;
  }

  update(id: number, updateTagPostDto: UpdateTagPostDto) {
    return `This action updates a #${id} tagPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} tagPost`;
  }
}
