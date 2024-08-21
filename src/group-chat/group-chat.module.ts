import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Message } from 'src/message/entities/message.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GroupChat,GroupMember,Message])],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
