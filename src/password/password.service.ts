import { Injectable } from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PasswordService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
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

        console.log("send mail ok" );
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
}
