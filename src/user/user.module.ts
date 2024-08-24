import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { LikeComment } from 'src/like-comment/entities/like-comment.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Friendship,LikeComment,Comment])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
