import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { LikeMessage } from 'src/like-message/entities/like-message.entity';
import { MessageRead } from 'src/message-read/entities/message-read.entity';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Message,LikeMessage,MessageRead,GroupChat])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
