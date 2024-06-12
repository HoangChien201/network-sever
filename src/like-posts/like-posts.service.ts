import { Injectable } from '@nestjs/common';
import { CreateLikePostDto } from './dto/create-like-post.dto';
import { UpdateLikePostDto } from './dto/update-like-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikePost } from './entities/like-post.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';

@Injectable()
export class LikePostsService {

  constructor(
    @InjectRepository(LikePost)
    private readonly likePostRepository: Repository<LikePost>
  ) { }

  async create(createLikePostDto: CreateLikePostDto, request: Request) {
    const creater = request.headers[USER_ID_HEADER_NAME]
    try {
      createLikePostDto['user'] = creater
      console.log(createLikePostDto);
      
      await this.likePostRepository.save(createLikePostDto);
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

  async findAll(): Promise < LikePost[] > {
      return await this.likePostRepository
        .createQueryBuilder('l')
        .leftJoinAndSelect('l.user_id', 'user')
        .leftJoinAndSelect('l.posts_id', 'posts')
        .getMany()

    }

  async findByUser(user_id: number): Promise < LikePost[] > {
      return await this.likePostRepository
        .createQueryBuilder('l')
        .leftJoinAndSelect('l.user_id', 'user')
        .leftJoinAndSelect('l.posts_id', 'posts')
        .where({
          user_id: user_id
        })
        .getMany()

    }

  async findByPosts(posts_id: number): Promise < LikePost[] > {
      return await this.likePostRepository
        .createQueryBuilder('l')
        .leftJoin('l.user', 'user')
        .addSelect(['user.fullname','user.avatar','user.id'])
        .where({
          posts: posts_id
        })
        .orderBy({
          'l.create_at': 'DESC'
        })
        .getMany()

    }

  async update(posts_id: number, user_id: number, updateLikePostDto: UpdateLikePostDto) {
      try {
        const likeOld = await this.likePostRepository.findOne({
          where: {
            user: user_id,
            posts: posts_id
          }
        })
        await this.likePostRepository.save({
          ...likeOld,
          ...updateLikePostDto
        })
        return {
          message: "Delete Success",
          status: 1
        };;
      } catch (error) {
        return {
          message: "Delete Failed" + error,
          status: 0
        };
      }

    }

  async remove(posts_id: number, user_id: number) {
      try {

        await this.likePostRepository.delete({
          posts: posts_id,
          user: user_id
        })

        return {
          message: "Delete Success",
          status: 1
        };

      } catch (error) {
        return {
          message: "Delete Failed" + error,
          status: 0
        };

      }
    }
  }
