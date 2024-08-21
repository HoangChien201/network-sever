import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/post/:id')
  async deeplinkpost(){
    return await this.appService.deeplink()
  }
  @Get('/user/:id')
  async deeplinkuser(){
    await this.appService.deeplink()
  }

}
