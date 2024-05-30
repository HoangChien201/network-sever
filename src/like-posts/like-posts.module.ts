import { Module } from '@nestjs/common';
import { LikePostsService } from './like-posts.service';
import { LikePostsController } from './like-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikePost } from './entities/like-post.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LikePost])],
  controllers: [LikePostsController],
  providers: [LikePostsService],
})
export class LikePostsModule {}
