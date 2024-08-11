import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async login(@Body() signInDto:Record<string,any> ){
        return this.authService.signIn(signInDto.email,signInDto.password);
    }

}
