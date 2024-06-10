import { Module } from '@nestjs/common';
import { LikeMessageService } from './like-message.service';
import { LikeMessageController } from './like-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeMessage } from './entities/like-message.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LikeMessage])],
  controllers: [LikeMessageController],
  providers: [LikeMessageService],
})
export class LikeMessageModule {}
