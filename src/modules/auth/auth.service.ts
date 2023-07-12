import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories';
import { SignInDto } from './dto/signIn.dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly userRepo = new UserRepository();
  constructor(
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepo.getUserByEmail(signInDto.email);
    if (!user) {
      throw new CustomErrorException(ERRORS.NotFound);
    }

    // Check if valid password
    const isValidPassword = this.userRepo.isPasswordValid(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new CustomErrorException(ERRORS.Unauthorized);
    }

    // Check if account active
    if (!user.isMailActive) {
      const token = crypto.randomBytes(32).toString('hex');
      this.userRepo.saveVerifyToken(user.email, token);

      this.mailService.sendUserConfirmation(user.email, token);

      throw new CustomErrorException(ERRORS.AccountUnactive);
    }

    // Generate AT & RT
    const payload = {
      user: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '60d', // 2 Month
      }),
    };
  }
}
