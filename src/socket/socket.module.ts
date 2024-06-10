import { Module } from '@nestjs/common';
import {SocketGateWay } from './socket.gateway';

@Module({
  providers: [SocketGateWay],
})
export class SocketModule {}
