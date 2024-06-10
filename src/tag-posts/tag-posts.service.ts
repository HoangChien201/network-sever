import { CreateTagPostDto } from './dto/create-tag-post.dto';
import { UpdateTagPostDto } from './dto/update-tag-post.dto';
import { Entity, Repository } from 'typeorm';
import { TagPost } from './entities/tag-post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Entity()
export class TagPostsService {
  constructor(
    @InjectRepository(TagPost)
    private readonly tagRepository:Repository<TagPost>
  ){}
  create(createTagPostDto: CreateTagPostDto) {
    return this.tagRepository.save(createTagPostDto);
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
