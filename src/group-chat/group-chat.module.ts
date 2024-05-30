import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GroupChat])],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
