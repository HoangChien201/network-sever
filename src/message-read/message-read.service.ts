import { Injectable } from '@nestjs/common';
import { CreateMessageReadDto } from './dto/create-message-read.dto';
import { UpdateMessageReadDto } from './dto/update-message-read.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRead } from './entities/message-read.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';

@Injectable()
export class MessageReadService {
  constructor(
    @InjectRepository(MessageRead)
    private readonly messageReadRepository:Repository<MessageRead>
  ){}
  
  async create(createMessageReadDto: CreateMessageReadDto,req:Request):Promise<MessageRead> {
    const user_req=req.headers[USER_ID_HEADER_NAME]
    
    createMessageReadDto.user=user_req

    return await this.messageReadRepository.save(createMessageReadDto);
  }

  async findAll() {
    return await this.messageReadRepository.find();
  }

}
