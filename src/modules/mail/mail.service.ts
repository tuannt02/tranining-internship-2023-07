import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `${this.configService.get<string>(
      'BASE_URL',
    )}/api/users/${email}/verify/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Vitalify Asia! Confirm your Email',
      text: url,
    });
  }

  async sendEmailForgotPassword(email: string, token: string) {
    const mailOptions: ISendMailOptions = {
      from: '"Vitalify Asia" <' + email,
      to: email,
      subject: 'Forgotten password',
      text: 'Forgot password',
      html:
        `Hi! <br><br> Your password reset code is: ${token}<br><br>` +
        'This is a security token, please do not share it with anyone',
    };

    await this.mailerService.sendMail(mailOptions);
  }
}
