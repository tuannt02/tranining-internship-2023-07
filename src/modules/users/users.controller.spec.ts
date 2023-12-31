import { TestingModule, Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule, MailModule],
      controllers: [UsersController],
      providers: [UsersService, MailService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Should signup success()', async () => {
    const params: SignupDto = {
      email: '20522122@gm.uit.edu.vn',
      password: 'Tuan2002@',
    };

    const spySignup = jest.spyOn(service, 'signup').mockResolvedValue({
      message: 'An Email sent to your account please verify',
    });

    await controller.signup(params);
    expect(spySignup).toHaveBeenCalledWith(params);
  });

  it('Should verify token success()', async () => {
    const params: { email: string; token: string } = {
      email: '20522122@gm.uit.edu.vn',
      token: '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
    };

    const spyVerifyToken = jest
      .spyOn(service, 'verifyToken')
      .mockResolvedValue({
        message: 'Email verified successfully',
      });

    await controller.verifyToken(params.email, params.token);
    expect(spyVerifyToken).toHaveBeenCalledWith(
      ...Object.keys(params).map((index) => params[index]),
    );
  });
});
