import { Module } from '@nestjs/common';
import {SocketGateWay } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
import { Message } from 'src/message/entities/message.entity';
import { MessageSocket, Notification } from './socket.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GroupMember])],
  providers: [SocketGateWay],

})
export class SocketModule {}
