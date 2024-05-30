import { Injectable } from '@nestjs/common';
import { CreateLikePostDto } from './dto/create-like-post.dto';
import { UpdateLikePostDto } from './dto/update-like-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikePost } from './entities/like-post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikePostsService {

  constructor(
    @InjectRepository(LikePost)
    private readonly likePostRepository:Repository<LikePost>
  ){}

  async create(createLikePostDto: CreateLikePostDto) {
    return await this.likePostRepository.save(createLikePostDto);
  }

  findAll() {
    return `This action returns all likePosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} likePost`;
  }

  update(id: number, updateLikePostDto: UpdateLikePostDto) {
    return `This action updates a #${id} likePost`;
  }

  remove(id: number) {
    return `This action removes a #${id} likePost`;
  }
}
