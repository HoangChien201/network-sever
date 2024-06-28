import { Module } from '@nestjs/common';
import {SocketGateWay } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from 'src/group-member/entities/group-member.entity';
<<<<<<< HEAD
=======
import { Message } from 'src/message/entities/message.entity';

>>>>>>> 151318f1533545f00f251ee086b6054c89657fac

@Module({
  imports:[TypeOrmModule.forFeature([GroupMember])],
  providers: [SocketGateWay],

})
export class SocketModule {}
