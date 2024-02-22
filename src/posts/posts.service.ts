import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like } from 'src/like/entities/like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>
  ) { }
  async create(createPostDto: CreatePostDto): Promise<Posts> {
    try {
      return await this.postsRepository.save({
        ...createPostDto,
        status:0
      });
    } catch (error) {
      return error
    }
  }

  async findByUser(user_id: number): Promise<Posts[]> {
    try {
      return this.postsRepository.createQueryBuilder('posts')
      .leftJoinAndMapOne('posts.user', User, 'user', 'user.id = posts.user')
      .leftJoinAndMapOne('posts.like',Like,'like','like.posts_id = posts.id')
      .where({
        user:user_id
      })
      .getMany()
    } catch (error) {
      return error
    }

  }

  async findPosts(user_id: number): Promise<Posts[]> {
    

  }

  async findOne(id: number): Promise<Posts> {
    try {
      return this.postsRepository.findOne({ where: { id: id } });
    } catch (error) {
      return error
    }
  }

  async findBrowsePosts(): Promise<Posts[]> {
    try {
      return await this.postsRepository.find({
        where:{
          status:0
        }
      });
    } catch (error) {
      return error;
    }
  }

  async BrowseRejectPosts(id:number): Promise<string> {
    try {
      await this.postsRepository.createQueryBuilder()
      .update(Posts)
      .set({status:2})
      .where("id = :id", { id: id })
      .execute()
      return 'rejected'
    } catch (error) {
      return error;
    }
  }

  async BrowseAcceptancePosts(id:number): Promise<string> {
    try {
      await this.postsRepository.createQueryBuilder()
      .update(Posts)
      .set({ status: 1 })
      .where("id = :id", { id: id })
      .execute()
      return 'accepted'
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<Posts[]> {
    try {
      return this.postsRepository.createQueryBuilder('posts')
      .leftJoinAndMapOne('posts.user', User, 'user', 'user.id = posts.user')
      .leftJoinAndMapOne('posts.like',Like,'like','like.posts_id = posts.id')
      .where({
        status:1
      })
      .getMany()
    } catch (error) {
      return error
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const posts = await this.postsRepository.findOne(
        {
          where: {
            id: id
          }
        })
      return this.postsRepository.save({
        ...posts,
        ...updatePostDto
      })
    } catch (error) {
      return error;

    }
  }

  async remove(id: number) {
    await this.postsRepository.delete({ id: id })
    return `deleted a #${id} post`;
  }
}
