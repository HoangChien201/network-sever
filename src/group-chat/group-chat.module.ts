import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports:[TypeOrmModule.forFeature([GroupChat,GroupMember])],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
