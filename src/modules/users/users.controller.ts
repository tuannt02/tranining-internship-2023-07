import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/api/users/create')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: SignupDto) {
    return this.usersService.signup(body);
  }

  @Get('/api/users/:email/verify/:token')
  @HttpCode(HttpStatus.OK)
  verifyToken(@Param('email') email: string, @Param('token') token: string) {
    return this.usersService.verifyToken(email, token);
  }

  @Post('/api/users/forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPwDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPwDto);
  }

  @Post('/api/users/reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPwDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPwDto);
  }

  @Put('/api/users/change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() changePwDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePwDto);
  }
}
