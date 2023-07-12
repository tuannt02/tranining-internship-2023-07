import { MailerService } from '@nestjs-modules/mailer';
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
}
