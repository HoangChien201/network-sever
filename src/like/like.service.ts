import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository:Repository<Like>
  ){}
  async create(createLikeDto: CreateLikeDto):Promise<Like> {
    try {
      return this.likeRepository.save(createLikeDto);
    } catch (error) {
      return error
    }
  }

  async remove(posts_id: number,user_id:number) {
    await this.likeRepository.delete({
      user_id:user_id,
      posts_id:posts_id
    })
    return `unlike`;
  }
}
