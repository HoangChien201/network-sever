import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { LikeComment } from 'src/like-comment/entities/like-comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comment,LikeComment])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
