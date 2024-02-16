import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commnentRepository:Repository<Comment>
  ){}

  async create(createCommentDto: CreateCommentDto):Promise<Comment> {
    try {
      return this.commnentRepository.save(createCommentDto)
    } catch (error) {
      return error
    }
  }

  findByPosts() {
    return `This action returns all comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(posts_id: number,user_id:number) {
    await this.commnentRepository.delete({
      user_id:user_id,
      posts_id:posts_id
    })
    return `unlike`;
  }
}
