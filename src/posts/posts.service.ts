import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>
  ) { }
  async create(createPostDto: CreatePostDto): Promise<CreatePostDto> {
    try {
      return await this.postsRepository.save(createPostDto);
    } catch (error) {
      return error
    }
  }

  async findByUser(user_id: number): Promise<Posts[]> {
    try {
      return this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.creater','creater')
      .innerJoinAndSelect('COUNT(posts.likes)','like')
      .where({creater:user_id})
      .getMany()
    } catch (error) {
      return error
    }

  }

  async findOne(id: number): Promise<Posts> {
    try {
      return this.postsRepository.findOne({ where: { id: id } });
    } catch (error) {
      return error
    }
  }


  async findAll(): Promise<Posts[]> {
    try {
      // return this.postsRepository.createQueryBuilder('posts')
      // .leftJoinAndMapOne('posts.user', User, 'user', 'user.id = posts.user')
      // .leftJoinAndMapOne('posts.like',Like,'like','like.posts_id = posts.id')
      // .where({
      //   // status:1
      // })
      // .orderBy(
      //   {
      //     create_time:'DESC'
      //   }
      // )
      // .getMany()
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
