import { Body, Controller, HttpCode, Post, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/api/users/create')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: SignupDto) {
    return this.usersService.signup(body);
  }
}
