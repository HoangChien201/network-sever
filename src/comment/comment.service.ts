import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { LikeComment } from 'src/like-comment/entities/like-comment.entity';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commnentRepository: Repository<Comment>
  ) { }

  async create(createCommentDto: CreateCommentDto,req:Request): Promise<any> {
    try {
      const creater= req.headers[USER_ID_HEADER_NAME]
      createCommentDto['user']=creater
      await this.commnentRepository.save(createCommentDto)
      return {
        status:1,
        message:"OK"
      }
    } catch (error) {
      return error
    }
  }

  async findByPosts(posts_id: number,request:Request): Promise<Comment[]> {
    //get user_id from token
    const userRequest= request.headers[USER_ID_HEADER_NAME]
    
    const commentQuery= await this.commnentRepository
      .createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .addSelect(['user.fullname','user.id','user.avatar'])
      .leftJoin('c.parent','parent')
      .addSelect('parent.id')
      .where({
        posts: posts_id,
        parent:IsNull()
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
          'c.posts =:posts_id',{posts_id:posts_id}
        )
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

  async findByCommentParent(comment_id: number,request:Request): Promise<Comment[]> {
    //get user_id from token
    const userRequest= request.headers[USER_ID_HEADER_NAME]
    
    const commentQuery= await this.commnentRepository
      .createQueryBuilder('c')
      .leftJoin('c.user', 'user')
      .addSelect(['user.fullname','user.id','user.avatar'])
      .leftJoin('c.parent','parent')
      .addSelect('parent.id')
      .where({
        parent: comment_id
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
          'c.parent =:comment_id',{comment_id:comment_id}
        )
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
      await this.commnentRepository.delete({
        id: id
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
