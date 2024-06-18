import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, pass: string): Promise<any> {

        const user = await this.userService.findUserByEmail(email)
        if(!user){
            throw new UnauthorizedException;
        }
        const isMatch = await bcrypt.compare(pass.toString(), user.password);

        if (!isMatch) {
            throw new UnauthorizedException;
        }

        user.password = undefined;
        const payload = { user: user };
        const token = await this.jwtService.signAsync(payload)
        return {
            data: {
                ...user,
                token
            }
        }
    }


}
