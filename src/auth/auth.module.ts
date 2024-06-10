import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal:true
    }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_AUTH,
      signOptions: { expiresIn: '3600000000000000000000000000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
