import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { LikeComment } from 'src/like-comment/entities/like-comment.entity';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { error } from 'console';
import { Request } from 'express';

const STATUS_SHOW=1;
const STATUS_HIDE=0;


@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commnentRepository: Repository<Comment>,
    @InjectRepository(LikeComment)
    private readonly likeCommnentRepository: Repository<LikeComment>
  ) { }

  async create(createCommentDto: CreateCommentDto, req: Request): Promise<any> {
    try {
      const creater = req.headers[USER_ID_HEADER_NAME]
      createCommentDto['user'] = creater
      createCommentDto['status'] = 1

      await this.commnentRepository.save(createCommentDto)
      return {
        status: 1,
        message: "OK"
      }
    } catch (error) {
      return {
        status: -1,
        message: "Not OK " + error
      }
    }
  }

  async findByPosts(posts_id: number, request: Request): Promise<Comment[]> {
    //get user_id from token
    const userRequest = request.headers[USER_ID_HEADER_NAME]

    const commentQuery = await this.commnentRepository
      .createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .addSelect(['user.fullname', 'user.id', 'user.avatar'])
      .leftJoin('c.parent', 'parent')
      .addSelect('parent.id')
      .where({
        posts: posts_id,
        parent: IsNull(),
        status:STATUS_SHOW
      })
      .orderBy({
        'c.create_at': 'DESC'
      })
      .getMany()

    const reactionComments = await this.commnentRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        (qb) =>
          qb.subQuery()
            .select('l.comment', 'comment')
            .addSelect('COUNT(l.comment)', 'like_count')
            .from(LikeComment, 'l')
            .groupBy('l.comment'),

        'l',
        'l.comment = c.id'
      )
      .leftJoin(
        (qb) =>
          qb.subQuery()
            .leftJoinAndSelect(
              (qb) =>
                qb.subQuery()
                  .select('l.*')
                  .from(LikeComment, 'l')
              ,
              'l', 'l.user=u.id'
            )
            .from(User, 'u')
            .where(`u.id=${userRequest}`)
        , 'u', 'u.comment=c.id'
      )
      .select([
        'l.like_count',
        'u.reaction',
      ])
      .where(
        'c.posts =:posts_id', { posts_id: posts_id }
      )
      .andWhere({ 
        parent: IsNull(),
        status:STATUS_SHOW
       })
      .orderBy('c.create_at', 'DESC')
      .getRawMany();

    // Convert raws to our appropriate objects 
    const comments = commentQuery.map((v, i) => {
      return {
        ...v,
        ...reactionComments[i]
      }
    })

    return comments;
  }

  async findByCommentParent(comment_id: number, request: Request): Promise<Comment[]> {
    //get user_id from token
    const userRequest = request.headers[USER_ID_HEADER_NAME]

    const commentQuery = await this.commnentRepository
      .createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .addSelect(['user.fullname', 'user.id', 'user.avatar'])
      .leftJoin('c.parent', 'parent')
      .addSelect('parent.id')
      .where({
        parent: comment_id,
        status:STATUS_SHOW
      })
      .orderBy({
        'c.create_at': 'DESC'
      })
      .getMany()

    const reactionComments = await this.commnentRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        (qb) =>
          qb.subQuery()
            .select('l.comment', 'comment')
            .addSelect('COUNT(l.comment)', 'like_count')
            .from(LikeComment, 'l')
            .groupBy('l.comment'),

        'l',
        'l.comment = c.id'
      )
      .leftJoin(
        (qb) =>
          qb.subQuery()
            .leftJoinAndSelect(
              (qb) =>
                qb.subQuery()
                  .select('l.*')
                  .from(LikeComment, 'l')
              ,
              'l', 'l.user=u.id'
            )
            .from(User, 'u')
            .where(`u.id=${userRequest}`)
        , 'u', 'u.comment=c.id'
      )
      .select([
        'l.like_count',
        'u.reaction',
      ])
      .where(
        'c.parent =:comment_id', { comment_id: comment_id }
      )
      .andWhere({
        status:STATUS_SHOW
      })
      .orderBy('c.create_at', 'DESC')
      .getRawMany();

    // Convert raws to our appropriate objects 
    const comments = commentQuery.map((v, i) => {
      return {
        ...v,
        ...reactionComments[i]
      }
    })

    return comments;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const commentOld = await this.commnentRepository.findOne({
        where: {
          id: id
        }
      })

      await this.commnentRepository.save({
        ...commentOld,
        ...updateCommentDto
      })
      return {
        message: "Update success",
        status: 1
      }
    } catch (error) {
      return {
        message: "Update failed",
        status: error
      }
    }

  }

  async remove(id: number) {
    try {
      // const commentChildren = await this.commnentRepository.createQueryBuilder('c')
      // .where({
      //   parent:id
      // })
      // .getMany()

      // if(commentChildren.length > 0){
        
      //   const commentChildrenIds = commentChildren.map((c) => c.id)
    
      //   await this.likeCommnentRepository.createQueryBuilder()
      //     .delete()
      //     .from(LikeComment)
      //     .where("comment IN (:...ids)", { ids: commentChildrenIds })
      //     .execute()
      // }

      // await this.commnentRepository.delete({
      //   parent: id
      // })

      // await this.likeCommnentRepository.createQueryBuilder()
      //     .delete()
      //     .from(LikeComment)
      //     .where("comment = :id", { id:id })
      //     .execute()

      // await this.commnentRepository.delete({
      //   id: id
      // })

      const commnent= await this.commnentRepository.findOne({where:{id:id}})
      if(!commnent) throw error
      await this.commnentRepository.save({
        ...commnent,
        status:0
      })
      return {
        message: "Delete success",
        status: 'OK'
      }
    } catch (error) {
      return {
        message: "Delete failed",
        status: error
      }
    }

  }



}
