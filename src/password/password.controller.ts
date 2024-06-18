import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordGuard } from './password.gruard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) { }

  @Post('/send-mail')
  async sendMailResetPassword(@Body() body: any) {
    return this.passwordService.sendMailResetPassword(body);
  }

  @Post('/verify-code')
  @UseGuards(PasswordGuard)
  async verifyCode() {
    return this.passwordService.verifyCodeResetPassword();
  }

  @Post('/reset-password')
  async resetPassword(@Body() body:UpdateCommentDto) {
    return this.passwordService.resetPassword(body);
  }

  @Post('/change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Body() body:UpdateCommentDto,@Req() req:Request) {
    return this.passwordService.changePassword(body,req);
  }

}
