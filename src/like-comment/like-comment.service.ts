import { Injectable } from '@nestjs/common';
import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
import { UpdateLikeCommentDto } from './dto/update-like-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeComment } from './entities/like-comment.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { Exception } from 'handlebars';
import { Request } from 'express';

@Injectable()
export class LikeCommentService {
  constructor(
    @InjectRepository(LikeComment)
    private readonly likeCommentRepository: Repository<LikeComment>
  ) { }

  async create(createLikeCommentDto: CreateLikeCommentDto, req: Request) {
    const creater = req.headers[USER_ID_HEADER_NAME]
    const {comment,reaction}=createLikeCommentDto
    createLikeCommentDto['user'] = creater
    try {
      const likeComment= await this.likeCommentRepository.findOne({
        where:{
          comment:comment,
          reaction:reaction,
          user:parseInt(creater.toString())
        }
      })

      if(likeComment){
        return {
          status: -1,
          message: "Like is exist"
        }
      }
      await this.likeCommentRepository.save(createLikeCommentDto);
      return {
        status: 1,
        message: "OK"
      }
    } catch (error) {
      return {
        status: -1,
        message: "Tè" + error
      }
    }

  }

  async findAll(): Promise<LikeComment[]> {
    return await this.likeCommentRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.user_id', 'user')
      .leftJoinAndSelect('l.comment_id', 'comment')
      .getMany()

  }

  async findByUser(user_id: number): Promise<LikeComment[]> {
    return await this.likeCommentRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.user_id', 'user')
      .leftJoinAndSelect('l.commen_id', 'comment')
      .where({
        user_id: user_id
      })
      .getMany()

  }

  async findByComment(comment_id: number): Promise<LikeComment[]> {
    return await this.likeCommentRepository
      .createQueryBuilder('l')
      .leftJoin('l.user', 'user')
      .addSelect(['user.fullname', 'user.id', 'user.avatar'])
      .where({
        comment: comment_id
      })
      .orderBy({
        'l.create_at': 'DESC'
      })
      .getMany()

  }

  async update( comment_id: number,user_id: number, updateLikeCommentDto: UpdateLikeCommentDto) {
    if (!comment_id || !user_id) {
      throw Exception
    }
    try {
      const likeOld = await this.likeCommentRepository.findOne({
        where: {
          user: user_id,
          comment: comment_id
        }
      })
      await this.likeCommentRepository.save({
        ...likeOld,
        ...updateLikeCommentDto
      })
      return {
        status:1,
        message:"successfully"
      };
    } catch (error) {
      return {
        status:-1,
        message:""+error
      };
    }
    
  }

  async remove(comment_id: number, user_id: number) {
    try {
      if (!comment_id || !user_id) {
        throw Exception
      }
      await this.likeCommentRepository.delete({
        comment: comment_id,
        user: user_id
      })

      return {
        message: "Delete Success",
        status: "OK"
      };

    } catch (error) {
      return {
        message: "Delete Failed",
        status: error
      };

    }
  }
}
