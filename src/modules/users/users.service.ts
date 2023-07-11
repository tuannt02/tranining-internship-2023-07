import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from '../../repositories';
import { CustomErrorException } from 'src/shared/exceptions/custom-error.exception';
import { ERRORS } from 'src/shared/constants';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private readonly userRepo = new UserRepository();
  constructor(private mailService: MailService) {}

  async signup(body: SignupDto) {
    const user = await this.userRepo.getUserByEmail(body.email);
    if (user) {
      throw new CustomErrorException(ERRORS.EmailExisted);
    }

    this.userRepo.createUser({ email: body.email, password: body.password });

    const token = crypto.randomBytes(32).toString('hex');
    this.userRepo.saveToken(body.email, token);
    this.mailService.sendUserConfirmation(body.email, token);

    return {
      message: 'An Email sent to your account please verify',
    };
  }
}
