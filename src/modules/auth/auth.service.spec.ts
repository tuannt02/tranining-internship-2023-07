import { TestingModule, Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SignInDto } from './dto/signIn.dto';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule, ConfigModule, MailModule],
      controllers: [AuthController],
      providers: [AuthService, MailService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should be definded', () => {
    expect(service).toBeDefined();
  });

  it('User not exist', async () => {
    const params: SignInDto = {
      email: '20522123@gm.uit.edu.vn',
      password: 'Tuan2002@',
    };

    jest
      .spyOn(service['userRepo'], 'getUserByEmail')
      .mockRejectedValue(new CustomErrorException(ERRORS.NotFound));

    try {
      await service.signIn(params);
    } catch (err) {
      expect(err.code).toEqual(ERRORS.NotFound.code);
      expect(err.statusCode).toEqual(ERRORS.NotFound.statusCode);
      expect(err.message).toEqual(ERRORS.NotFound.message);
    }
  });

  it('User type wrong password', async () => {
    const params: SignInDto = {
      email: '20522122@gm.uit.edu.vn',
      password: 'Tuan2002@@',
    };

    jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
      email: '20522122@gm.uit.edu.vn',
      isMailActive: false, // Accepted all true or false
      password: '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
      verifyToken: '', // Can be empty string
      createdAt: 1689343792,
      updatedAt: 1689343792,
    });

    try {
      await service.signIn(params);
    } catch (err) {
      expect(err.code).toEqual(ERRORS.Unauthorized.code);
      expect(err.statusCode).toEqual(ERRORS.Unauthorized.statusCode);
      expect(err.message).toEqual(ERRORS.Unauthorized.message);
    }
  });

  it('User with unactive account', async () => {
    const params: SignInDto = {
      email: 'bladehotboy@gmail.com',
      password: 'Tuannt02@',
    };

    jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
      email: 'bladehotboy@gmail.com',
      isMailActive: false, // Accepted all true or false
      password: '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
      verifyToken: '', // Can be empty string
      createdAt: 1689343792,
      updatedAt: 1689343792,
    });

    try {
      await service.signIn(params);
    } catch (err) {
      expect(err.code).toEqual(ERRORS.AccountUnactive.code);
      expect(err.statusCode).toEqual(ERRORS.AccountUnactive.statusCode);
      expect(err.message).toEqual(ERRORS.AccountUnactive.message);
    }
  });

  it('User sign in successfully', async () => {
    const params: SignInDto = {
      email: '20522122@gm.uit.edu.vn',
      password: 'Tuannt02@',
    };

    jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
      email: '20522122@gm.uit.edu.vn',
      isMailActive: true, // Accepted all true or false
      password: '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
      verifyToken: '', // Can be empty string
      createdAt: 1689343792,
      updatedAt: 1689343792,
    });

    jest.spyOn(service['jwtService'], 'signAsync').mockResolvedValue('token');
    const res = await service.signIn(params);

    expect(res).toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    });
  });
});
