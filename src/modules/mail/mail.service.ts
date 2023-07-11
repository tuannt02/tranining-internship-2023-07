import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `${process.env.BASE_URL}/api/users/${email}/verify/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Vitalify Asia! Confirm your Email',
      text: url,
    });
  }
}
