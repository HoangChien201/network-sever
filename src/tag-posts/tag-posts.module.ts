import { Module } from '@nestjs/common';
import { TagPostsService } from './tag-posts.service';
import { TagPostsController } from './tag-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagPost } from './entities/tag-post.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TagPost])],
  controllers: [TagPostsController],
  providers: [TagPostsService],
})
export class TagPostsModule {}
