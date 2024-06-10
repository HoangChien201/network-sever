import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository:Repository<Media>
  ){}

  async findByUser(request:Request):Promise<Media[]> {
    try {
      const user_req=request.headers[USER_ID_HEADER_NAME]
      return await this.mediaRepository
      .createQueryBuilder('media')
      .leftJoin('media.posts_id','posts')
      .addSelect('posts.creater')
      .where(`posts.creater = ${user_req}`)
      .getMany()
    } catch (error) {
      return []
    }
    
  }

}
