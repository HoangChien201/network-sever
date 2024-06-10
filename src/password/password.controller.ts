import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordGuard } from './password.gruard';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('/send-mail')
  async sendMailResetPassword(@Body() body:any){
      return this.passwordService.sendMailResetPassword(body);
  }

  @Post('/verify-code')
  @UseGuards(PasswordGuard)
  async verifyCode(){
    return this.passwordService.verifyCodeResetPassword();
}

}
