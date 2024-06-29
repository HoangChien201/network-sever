import { Module } from '@nestjs/common';
import {SocketGateWay } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Message } from 'src/message/entities/message.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';


@Module({
  imports:[TypeOrmModule.forFeature([GroupMember,Friendship])],
  providers: [SocketGateWay],

})
export class SocketModule {}
