import { Injectable } from '@nestjs/common';
import { CreateLikeMessageDto } from './dto/create-like-message.dto';
import { UpdateLikeMessageDto } from './dto/update-like-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeMessage } from './entities/like-message.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { Request } from 'express';

@Injectable()
export class LikeMessageService {
  constructor(
    @InjectRepository(LikeMessage)
    private readonly likeMessageRepository: Repository<LikeMessage>
  ) { }

  async create(createLikeMessageDto: CreateLikeMessageDto, req: Request): Promise<any> {
    try {
      const user_req = req.headers[USER_ID_HEADER_NAME]

     await this.likeMessageRepository.save({
      ...createLikeMessageDto,
      user: parseInt(user_req.toString())
    });
    return {
      status:1,
      message:"OK"
    }
    } catch (error) {
      return {
        status:1,
        message:"NOT OK - " + error
      }
    }
    
  }

  async findByMessage(message_id: number) {
    const reactionQuery =
      await this.likeMessageRepository
        .createQueryBuilder('l')
        .leftJoin('l.user', 'user')
        .addSelect(['user.id', 'user.fullname', 'user.avatar'])
        .where({
          message: message_id
        })
        .getMany()
    return reactionQuery;
  }

  async update(request: Request, updateLikeMessageDto: UpdateLikeMessageDto) {
    const user_req = request.headers[USER_ID_HEADER_NAME]
    try {
      const { message, reaction } = updateLikeMessageDto

      const likeMessageOld = await this.likeMessageRepository.findOne({
        where: {
          user: parseInt(user_req.toString()),
          message: message
        }
      })
      
      if (likeMessageOld){
        return {
          status:-1,
          message:"Not found"
        }
      }

      await this.likeMessageRepository.save({
        ...likeMessageOld,
        reaction
      })

      return {
        status:1,
        message:"Update Success"
      }

    } catch (error) {
      return {
        status:-1,
        message:"Update Failed"+error
      }
    }


  }

  async remove(mesage_id: number,user_id:number,request:Request) {
    const user_req = request.headers[USER_ID_HEADER_NAME]
    try {
      if (+user_id !== +user_req) {
        return {
          status:-1,
          message:"Not perform"
        }
      }

      await this.likeMessageRepository.delete({
        user:user_id,
        message:mesage_id
      })

      return {
        status:1,
        message:"Delete Success"
      }

    } catch (error) {
      return {
        status:-1,
        message:"Delete Failed"+error
      }
    }
  }
}
