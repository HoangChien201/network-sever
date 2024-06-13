import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto):Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll():Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('get-one/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string,@Req() req:Request):Promise<User | null> {
    return this.userService.findOne(+id,req);
  }

  @Get('history-activity')
  @UseGuards(AuthGuard)
  historyActivity(@Req() req:Request):Promise<User | any> {
    return this.userService.historyActivitiy(req);
  }

  @Get('/search?')
  @UseGuards(AuthGuard)
  search(@Req() req:Request,@Query('keyword') keyword:string):Promise<User[]> {
    return this.userService.search(keyword,req);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto):Promise<User|null> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string):Promise<void> {
    return this.userService.remove(+id);
  }
}
