import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createFriendshipDto: CreateFriendshipDto,@Req() req:Request) {
    return this.friendshipService.create(createFriendshipDto,req);
  }

  @Post('/get-all')
  @UseGuards(AuthGuard)
  async friends(@Req() req:Request,@Body() body:any) {
    return this.friendshipService.friends(req,body);
  }

  @Get('/receive-request')
  @UseGuards(AuthGuard)
  async receiveRequestFriend(@Req() req:Request) {
    return this.friendshipService.receiveRequestFriend(req);
  }

  @Get('/recommend')
  @UseGuards(AuthGuard)
  async recommend(@Req() req:Request) {
    return this.friendshipService.recommend(req);
  }

  @Get('/search?')
  @UseGuards(AuthGuard)
  async search(@Query('keyword') keyword:string,@Req() req:Request) {
    return this.friendshipService.search(keyword,req);
  }

  @Delete('un-friendship?')
  unFriendShip(@Body() body:any) {
    return this.friendshipService.unFriendShip(body);
  }
}
