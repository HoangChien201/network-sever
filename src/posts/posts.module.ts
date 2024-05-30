import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './entities/posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikePost } from 'src/like-posts/entities/like-post.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Posts,LikePost])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
