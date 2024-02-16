import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { AuthGuard } from './auth.guard';

@Module({
  imports:[
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.SECRET_ADMIN,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
