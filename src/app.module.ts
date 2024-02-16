import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Topic } from './topic/entities/topic.entity';
import { User } from './user/entities/user.entity';
import { Event } from './event/entities/event.entity';
import { TopicModule } from './topic/topic.module';
import { EventModule } from './event/event.module';
import { DataSource } from 'typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { RatingModule } from './rating/rating.module';
import { FollowModule } from './follow/follow.module';
import { Like } from './like/entities/like.entity';
import { Posts } from './posts/entities/post.entity';
import { Comment } from './comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'mysql-event-hoangchien220401-6255.a.aivencloud.com',
    port: 19790,
    username: 'avnadmin',
    password: 'AVNS_C3GX0oWgNQNDEl4kl_F',
    database: 'defaultdb',
    entities: [Topic,User,Event,Comment,Like,Posts],
    synchronize: true,
  }),
  TopicModule,
  UserModule,
  EventModule,
  CloudinaryModule,
  AuthModule,
  PostsModule,
  LikeModule,
  CommentModule,
  RatingModule,
  FollowModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
