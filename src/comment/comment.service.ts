import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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

  async findByPosts(posts_id:number):Promise<Comment[]> {
    return await this.commnentRepository.createQueryBuilder('comment')
    .leftJoinAndMapOne('comment.user',User,'user','user.id=comment.user')
    .where({
      posts_id:posts_id
    })
    .orderBy({
      create_time:'DESC'
    })
    .getMany()
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(posts_id: number,user_id:number) {
    // await this.commnentRepository.delete({
    //   user:user_id,
    //   posts_id:posts_id
    // })
    // return `unlike`;
  }
}
