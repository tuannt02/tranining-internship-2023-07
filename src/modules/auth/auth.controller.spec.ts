import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { SignInDto } from './dto/signIn.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule, MailModule],
      controllers: [AuthController],
      providers: [AuthService, MailService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('Should signin success()', async () => {
    const params: SignInDto = {
      email: '20522122@gm.uit.edu.vn',
      password: 'Tuan2002@',
    };

    const spySignin = jest.spyOn(service, 'signIn').mockResolvedValue({
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im1haWwiOiIyMDUyMjEyMkBnbS51aXQuZWR1LnZuIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4OTEzMDQ3OSwiZXhwIjoxNjg5MjE2ODc5fQ.ejbj4cFIQleHNA-nr_XcGihveyhiP0wygcn4QjokTHA',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im1haWwiOiIyMDUyMjEyMkBnbS51aXQuZWR1LnZuIiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTY4OTEzMDQ3OSwiZXhwIjoxNzIwNjg4MDc5fQ.hHh6kix4lMjalTU5pFUgw5dwmut49_0CiK8-YV3cVNQ',
    });

    await controller.signIn(params);
    expect(spySignin).toHaveBeenCalledWith(params);
  });
});
