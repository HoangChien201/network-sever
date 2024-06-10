import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
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
      secret: process.env.SECRET_PASSWORD,
      signOptions: { expiresIn: '360s' },
    }),
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
