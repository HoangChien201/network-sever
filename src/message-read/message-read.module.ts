import { Module } from '@nestjs/common';
import { MessageReadService } from './message-read.service';
import { MessageReadController } from './message-read.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRead } from './entities/message-read.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MessageRead])],
  controllers: [MessageReadController],
  providers: [MessageReadService],
})
export class MessageReadModule {}
