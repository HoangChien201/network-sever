import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { DataSource } from 'typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentModule } from './comment/comment.module';
import { Posts } from './posts/entities/posts.entity';
import { Comment } from './comment/entities/comment.entity';
import { ConfigModule } from '@nestjs/config';
import { LikePostsModule } from './like-posts/like-posts.module';
import { LikeCommentModule } from './like-comment/like-comment.module';
import { FriendshipModule } from './friendship/friendship.module';
import { MessageModule } from './message/message.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { MediaModule } from './media/media.module';
import { LikePost } from './like-posts/entities/like-post.entity';
import { LikeComment } from './like-comment/entities/like-comment.entity';
import { TagPostsModule } from './tag-posts/tag-posts.module';
import { Media } from './media/entities/media.entity';
import { TagPost } from './tag-posts/entities/tag-post.entity';
import { GroupMember } from './group-member/entities/group-member.entity';
import { GroupChat } from './group-chat/entities/group-chat.entity';
import { Message } from './message/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'networkDB',
    entities: [User,Comment,LikePost,LikeComment,Posts,Media,TagPost,GroupMember,GroupChat,Message],
    synchronize: false,
  }),
  UserModule,
  CloudinaryModule,
  AuthModule,
  PostsModule,
  CommentModule,
  LikePostsModule,
  LikeCommentModule,
  FriendshipModule,
  MessageModule,
  GroupChatModule,
  GroupMemberModule,
  MediaModule,
  TagPostsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
