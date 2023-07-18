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
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

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

  describe('Sign up', () => {
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

  describe('Verify token', () => {
    it('Email not exist', async () => {
      const params: { email: string; token: string } = {
        email: '20522122@gm.uit.edu.vn',
        token:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
      };

      jest
        .spyOn(service['userRepo'], 'getUserByEmail')
        .mockResolvedValue(undefined);

      try {
        await service.verifyToken(params.email, params.token);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.InvalidLink.code);
        expect(err.statusCode).toEqual(ERRORS.InvalidLink.statusCode);
        expect(err.message).toEqual(ERRORS.InvalidLink.message);
      }
    });

    it('Verify token not match', async () => {
      const params: { email: string; token: string } = {
        email: '20522122@gm.uit.edu.vn',
        token:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: false, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken:
          '07d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      try {
        await service.verifyToken(params.email, params.token);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.InvalidLink.code);
        expect(err.statusCode).toEqual(ERRORS.InvalidLink.statusCode);
        expect(err.message).toEqual(ERRORS.InvalidLink.message);
      }
    });

    it('Verify token successfully', async () => {
      const params: { email: string; token: string } = {
        email: '20522122@gm.uit.edu.vn',
        token:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: false, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      const res = await service.verifyToken(params.email, params.token);
      expect(res).toEqual({
        message: 'Email verified successfully',
      });
    });
  });

  describe('Forgot password', () => {
    it('Email not registered', async () => {
      const params: ForgotPasswordDto = {
        email: '20522122@gm.uit.edu.vn',
      };

      jest
        .spyOn(service['userRepo'], 'getUserByEmail')
        .mockResolvedValue(undefined);

      try {
        await service.forgotPassword(params);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.EmailNotRegistered.code);
        expect(err.statusCode).toEqual(ERRORS.EmailNotRegistered.statusCode);
        expect(err.message).toEqual(ERRORS.EmailNotRegistered.message);
      }
    });

    it('Forgot password is sent successfully', async () => {
      const params: ForgotPasswordDto = {
        email: '20522122@gm.uit.edu.vn',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: false, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      const res = await service.forgotPassword(params);
      expect(res).toEqual({
        message: 'An Email reset password sent to your account please confirm',
      });
    });
  });
});
