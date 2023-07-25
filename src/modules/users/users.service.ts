import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from '../../repositories';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class UsersService {
  private readonly userRepo = new UserRepository();
  constructor(private mailService: MailService) {}

  async signup(body: SignupDto) {
    const user = await this.userRepo.getUserByEmail(body.email);
    if (user) {
      throw new CustomErrorException(ERRORS.EmailExisted);
    }

    const token = crypto.randomBytes(32).toString('hex');
    this.userRepo.createUser({
      email: body.email,
      password: body.password,
      verifyToken: token,
    });

    this.mailService.sendUserConfirmation(body.email, token);

    return {
      message: 'An Email sent to your account please verify',
    };
  }

  async verifyToken(email: string, token: string) {
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      throw new CustomErrorException(ERRORS.InvalidLink);
    }

    const { verifyToken } = user;
    if (verifyToken !== token) {
      throw new CustomErrorException(ERRORS.InvalidLink);
    }

    this.userRepo.verifySuccess(email);

    return {
      message: 'Email verified successfully',
    };
  }

  async forgotPassword(params: ForgotPasswordDto) {
    const user = await this.userRepo.getUserByEmail(params.email);
    if (!user) {
      throw new CustomErrorException(ERRORS.EmailNotRegisterd);
    }

    const token = crypto.randomBytes(32).toString('hex');
    this.userRepo.saveForgetPasswordToken(params.email, token);
    this.mailService.sendEmailForgotPassword(params.email, token);

    return {
      messsage: 'An Email reset password sent to your account please confirm',
    };
  }

  async resetPassword(resetPwDto: ResetPasswordDto) {
    // Check if email valid
    const user = await this.userRepo.getUserByEmail(resetPwDto.email);
    if (!user) {
      throw new CustomErrorException(ERRORS.InvalidLink);
    }

    // Check if token valid
    if (user?.forgotPwToken !== resetPwDto.token) {
      throw new CustomErrorException(ERRORS.InvalidLink);
    }
    await this.userRepo.saveForgetPasswordToken(resetPwDto.email, '');

    // Update password
    await this.userRepo.updatePassword(
      resetPwDto.email,
      resetPwDto.newPassword,
    );

    return {
      message: 'Password reset successfully',
    };
  }

  async changePassword(changePwDto: ChangePasswordDto) {
    const user = await this.userRepo.getUserByEmail(changePwDto.email);
    if (!user) {
      throw new CustomErrorException(ERRORS.EmailNotRegisterd);
    }

    // Check if valid password
    const isValidPassword = await this.userRepo.isPasswordValid(
      changePwDto.oldPassword,
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

    // Update password
    await this.userRepo.updatePassword(
      changePwDto.email,
      changePwDto.newPassword,
    );

    return {
      message: 'Password change successfully',
    };
  }

  public healthCheck() {
    return {
      server: 'Active',
    };
  }
}
