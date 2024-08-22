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
import { Friendship } from './friendship/entities/friendship.entity';
import { SocketModule } from './socket/socket.module';
import { PasswordModule } from './password/password.module';
import { LikeMessageModule } from './like-message/like-message.module';
import { LikeMessage } from './like-message/entities/like-message.entity';
import { MessageReadModule } from './message-read/message-read.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({

  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB,
      port: parseInt(process.env.PORT_DB),
      username: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
      entities: [User, Friendship, Posts, Comment, LikeComment, LikePost, Message, Media, TagPost, GroupChat, GroupMember, LikeMessage],
      synchronize: false,
      autoLoadEntities: true,
      timezone:'+07:00'
    }),
    FriendshipModule,
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
    SocketModule,
    // PasswordModule,
    LikeMessageModule,
    MessageReadModule,

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '.well-known'),
      serveRoot: '/.well-known',  // Chỉ phục vụ các tệp từ đường dẫn này
      exclude: ['/'],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
