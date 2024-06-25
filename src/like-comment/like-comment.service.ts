import { Injectable } from '@nestjs/common';
import { CreateLikeCommentDto } from './dto/create-like-comment.dto';
import { UpdateLikeCommentDto } from './dto/update-like-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeComment } from './entities/like-comment.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { error } from 'console';
import { Exception } from 'handlebars';

@Injectable()
export class LikeCommentService {
  constructor(
    @InjectRepository(LikeComment)
    private readonly likePostRepository: Repository<LikeComment>
  ) { }

  async create(createLikeCommentDto: CreateLikeCommentDto, req: Request) {
    const creater = req.headers[USER_ID_HEADER_NAME]
    createLikeCommentDto['user'] = creater
    try {
      await this.likePostRepository.save(createLikeCommentDto);
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
    return await this.likePostRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.user_id', 'user')
      .leftJoinAndSelect('l.comment_id', 'comment')
      .getMany()

  }

  async findByUser(user_id: number): Promise<LikeComment[]> {
    return await this.likePostRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.user_id', 'user')
      .leftJoinAndSelect('l.commen_id', 'comment')
      .where({
        user_id: user_id
      })
      .getMany()

  }

  async findByComment(comment_id: number): Promise<LikeComment[]> {
    return await this.likePostRepository
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

  async update(user_id: number, comment_id: number, updateLikeCommentDto: UpdateLikeCommentDto) {
    if (!comment_id || !user_id) {
      throw Exception
    }

    const likeOld = await this.likePostRepository.findOne({
      where: {
        user: user_id,
        comment: comment_id
      }
    })
    const likeUpdate = await this.likePostRepository.save({
      ...likeOld,
      ...updateLikeCommentDto
    })
    return likeUpdate;
  }

  async remove(comment_id: number, user_id: number) {
    try {
      if (!comment_id || !user_id) {
        throw Exception
      }
      await this.likePostRepository.delete({
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
