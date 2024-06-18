import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async sendMailResetPassword(body: any): Promise<any> {

    const code = Math.floor(Math.random() * 100000)
    const token = await this.jwtService.signAsync({ code: code })
    this.mailerService
      .sendMail({
        to: body.to, // list of receivers
        from: 'noreply@netforge.com', // sender address
        subject: `Mã của bạn - ${code}`, // Subject line
        html: `
            <div>
                Xin chào
                <br>
                <br>
                    Mã của bạn là: ${code}. Sử dụng nó để xác thực lấy lại mật khẩu của bạn.<br>
                <br>
                    Nếu bạn không yêu cầu điều này, lờ cmn tin nhắn này đi.<br>
                <br>
                Trân trọng,
                <br>
                Đội ngũ NetForge
                <div>
                    <br>
                </div>
            </div>`, // HTML body content
      })
      .then(() => {

        console.log("send mail ok");
      })
      .catch((error) => {
        console.log("send mail not ok" + error);
      });

    return { token: token }

  }

  async verifyCodeResetPassword(): Promise<any> {
    return {
      "message": "Successful Authentication",
      "statusCode": 1
    }
  }

  async resetPassword(body: any): Promise<any> {
    try {
      
      let { password,email } = body
      const saltOrRounds = parseInt(process.env.SALTORROUNDS)
      
      password = await bcrypt.hash(password.toString(), saltOrRounds);
      const idUser= await this.userService.findUserByEmail(email)
      await this.userService.update(idUser.id,{password})
      return {
        "message": "Successful Reset",
        "status": 1
      }
    } catch (error) {
      return {
        "message": "Failed Reset " + error,
        "status": -1
      }
    }
  }
}
