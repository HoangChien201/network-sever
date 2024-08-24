import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as nodemailer from 'nodemailer';

@Injectable()
export class PasswordService {
  private transporter;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // hoặc bất kỳ service nào bạn sử dụng
      auth: {
        user: process.env.MAILDEV_INCOMING_USER,
        pass: process.env.MAILDEV_INCOMING_PASS,
      },
    });
   }

  async sendMailResetPassword(body: any): Promise<any> {
    const code = Math.floor(Math.random() * (99999-10000)) + 10000
    const token = await this.jwtService.signAsync({ code: code })

    const {to:email} = body

    const user = await this.userRepository.findOne({where:{email}})
    
    if(!user){
      return {
        status:-1,
        message:"Email không tồn tại !"
      };
    }

    const mailOptions = {
      from: 'Netfore', // sender address
      to:email,
      subject:`Mã của bạn - ${code}`,
      html:`
            <div>
                Xin chào
                <br>
                <br>
                    Mã của bạn là: ${code}. Sử dụng nó để xác thực lấy lại mật khẩu của bạn.<br>
                <br>
                    Nếu bạn không yêu cầu điều này, vui lòng bỏ qua tin nhắn này.<br>
                <br>
                Trân trọng,
                <br>
                Đội ngũ NetForge
                <div>
                    <br>
                </div>
            </div>`,
    };
    this.transporter.sendMail(mailOptions)
    .then(()=>{
    })
    
    return {
      status:1,
      token
    };;

  }

  async verifyCodeResetPassword(): Promise<any> {
    return {
      "message": "Successful Authentication",
      "statusCode": 1
    }
  }

  async resetPassword(body: any): Promise<any> {
    try {

      let { password, email } = body
      const saltOrRounds = parseInt(process.env.SALTORROUNDS)

      password = await bcrypt.hash(password.toString(), saltOrRounds);
      const idUser = await this.userService.findUserByEmail(email)
      await this.userService.update(idUser.id, { password })
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

  async changePassword(body: any, request: Request): Promise<any> {
    try {
      let { passwordOld, passwordNew } = body
      const user_req = request.headers[USER_ID_HEADER_NAME]
      const user = await this.userRepository.findOne({ where: { id: parseInt(user_req.toString()) } })

      const isMatch = await bcrypt.compare(passwordOld.toString(), user.password);

      if (!isMatch) {
        return {
          "message": "Password not match",
          "status": -2
        }
      }

      const saltOrRounds = parseInt(process.env.SALTORROUNDS)
      const password = await bcrypt.hash(passwordNew.toString(), saltOrRounds);
      await this.userService.update(parseInt(user_req.toString()), { password })
      return {
        "message": "Successful Change",
        "status": 1
      }
    } catch (error) {
      return {
        "message": "Failed Change " + error,
        "status": -1
      }
    }
  }

}
