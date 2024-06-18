import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

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
    TypeOrmModule.forFeature([User])
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
