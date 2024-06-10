import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Media } from './entities/media.entity';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('/get-by-user')
  @UseGuards(AuthGuard)
  async findByUser(@Req() req:Request):Promise<Media[]> {
    return this.mediaService.findByUser(req);
  }

}
