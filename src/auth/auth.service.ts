import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService
    ){}

    async signIn(email:string,pass:string):Promise<any>{
        const user= await this.userService.findUserByEmail(email)
        
        if(user?.password !== pass){
            throw new UnauthorizedException;
        }

        const payload = { user: user };
        const token=await this.jwtService.signAsync(payload)
        return {
            data:{
                ...user,
                token
            }
        }
    }

    // async signInAdmin(email:string,pass:string):Promise<UserInterface>{
    //     const user= await this.userService.findByEmail(email)
        
    //     if(user?.role !== 'admin'){
    //         throw new UnauthorizedException;
    //     }

    //     if(user?.password !== pass){
    //         throw new UnauthorizedException;
    //     }

    //     const payload = { user: user };
    //     const token=await this.jwtService.signAsync(payload)
    //     user.token=token
    //     return user
    // }

}
