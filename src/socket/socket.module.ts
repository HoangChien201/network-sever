import { Module } from '@nestjs/common';
import {SocketGateWay } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GroupMember])],
  providers: [SocketGateWay],

})
export class SocketModule {}
