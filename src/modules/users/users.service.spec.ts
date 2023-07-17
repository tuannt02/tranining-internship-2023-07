import { TestingModule, Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { UsersController } from './users.controller';
import { MailService } from '../mail/mail.service';
import { SignupDto } from './dto/signup.dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';

describe('UserService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule, MailModule],
      controllers: [UsersController],
      providers: [UsersService, MailService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Should be definded', () => {
    expect(service).toBeDefined();
  });

  it('Email exist', async () => {
    const params: SignupDto = {
      email: '20522212@gm.uit.edu.vn',
      password: 'Tuan2002@',
    };

    jest
      .spyOn(service['userRepo'], 'getUserByEmail')
      .mockRejectedValue(new CustomErrorException(ERRORS.EmailExisted));

    try {
      await service.signup(params);
    } catch (err) {
      expect(err.code).toEqual(ERRORS.EmailExisted.code);
      expect(err.statusCode).toEqual(ERRORS.EmailExisted.statusCode);
      expect(err.message).toEqual(ERRORS.EmailExisted.message);
    }
  });

  it('User sign up successfully', async () => {
    const params: SignupDto = {
      email: '20522212@gm.uit.edu.vn',
      password: 'Tuan2002@',
    };

    jest
      .spyOn(service['userRepo'], 'getUserByEmail')
      .mockResolvedValue(undefined);

    jest.spyOn(service['userRepo'], 'createUser').mockResolvedValue();

    const res = await service.signup(params);
    expect(res).toEqual({
      message: 'An Email sent to your account please verify',
    });
  });
});
