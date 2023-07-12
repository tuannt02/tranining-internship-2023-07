import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

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

  @Get('/api/users/forgot-password/:email')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Param() forgotPwParamDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPwParamDto);
  }
}
