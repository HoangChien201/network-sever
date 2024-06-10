import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts } from './entities/posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikePost } from 'src/like-posts/entities/like-post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { TagPost } from 'src/tag-posts/entities/tag-post.entity';
import { Media } from 'src/media/entities/media.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { LikeComment } from 'src/like-comment/entities/like-comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Posts,LikePost,Comment,TagPost,Media,Friendship,LikeComment])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
