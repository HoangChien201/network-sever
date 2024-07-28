import { Module } from '@nestjs/common';
import {SocketGateWay } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { MessageReadModule } from 'src/message-read/message-read.module';
import { LikeMessageModule } from 'src/like-message/like-message.module';
import { MessageReadService } from 'src/message-read/message-read.service';
import { Message } from 'src/message/entities/message.entity';
import { MessageRead } from 'src/message-read/entities/message-read.entity';
import { LikeMessage } from 'src/like-message/entities/like-message.entity';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports:[
    TypeOrmModule.forFeature([GroupMember,Friendship,Message,MessageRead,LikeMessage,User]),
],
  providers: [SocketGateWay],

})
export class SocketModule {}
