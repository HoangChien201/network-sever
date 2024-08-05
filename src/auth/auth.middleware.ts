import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
// other imports

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService){}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('authorization');

    if (!authHeader) {
      throw new HttpException('No auth token', HttpStatus.UNAUTHORIZED);
    }

    const bearerToken: string[] = authHeader.split(' ');
    const token: string = bearerToken[1];
    
    if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.SECRET_AUTH
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        req['userLogin']=payload.user
      } catch {
        throw new UnauthorizedException();
      }

    next();
  }
}