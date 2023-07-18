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
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

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

  describe('Reset password', () => {
    it('Email not exist', async () => {
      const params: ResetPasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        token:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
        newPassword: 'Tuannt03@',
      };

      jest
        .spyOn(service['userRepo'], 'getUserByEmail')
        .mockResolvedValue(undefined);

      try {
        await service.resetPassword(params);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.InvalidLink.code);
        expect(err.statusCode).toEqual(ERRORS.InvalidLink.statusCode);
        expect(err.message).toEqual(ERRORS.InvalidLink.message);
      }
    });

    it('Forget token not match', async () => {
      const params: ResetPasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        token:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
        newPassword: 'Tuannt03@',
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
        await service.resetPassword(params);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.InvalidLink.code);
        expect(err.statusCode).toEqual(ERRORS.InvalidLink.statusCode);
        expect(err.message).toEqual(ERRORS.InvalidLink.message);
      }
    });

    it('Reset password successfully', async () => {
      const params: ResetPasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        token:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b',
        newPassword: 'Tuannt03@',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: false, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken: '', // Can be empty string
        forgotPwToken:
          '06d7588460b728a5a6a062b614f716d3ff5795b8ee522a115b7438fc84d4651b', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      jest
        .spyOn(service['userRepo'], 'saveForgetPasswordToken')
        .mockResolvedValue();

      jest.spyOn(service['userRepo'], 'updatePassword').mockResolvedValue();

      const res = await service.resetPassword(params);
      expect(res).toEqual({
        message: 'Password reset successfully',
      });
    });
  });

  describe('Change password', () => {
    it('Email not registered', async () => {
      const params: ChangePasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        oldPassword: 'Tuannt02@',
        newPassword: 'Tuannt03@',
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

    it('Wrong old password', async () => {
      const params: ChangePasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        oldPassword: 'Tuannt04@',
        newPassword: 'Tuannt03@',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: false, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken: '', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      try {
        await service.changePassword(params);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.Unauthorized.code);
        expect(err.statusCode).toEqual(ERRORS.Unauthorized.statusCode);
        expect(err.message).toEqual(ERRORS.Unauthorized.message);
      }
    });

    it('Account unactive', async () => {
      const params: ChangePasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        oldPassword: 'Tuannt02@',
        newPassword: 'Tuannt03@',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: false, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken: '', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      jest.spyOn(service['userRepo'], 'saveVerifyToken').mockResolvedValue();
      jest
        .spyOn(service['mailService'], 'sendUserConfirmation')
        .mockResolvedValue();

      try {
        await service.changePassword(params);
      } catch (err) {
        expect(err.code).toEqual(ERRORS.AccountUnactive.code);
        expect(err.statusCode).toEqual(ERRORS.AccountUnactive.statusCode);
        expect(err.message).toEqual(ERRORS.AccountUnactive.message);
      }
    });

    it('Change password successfully', async () => {
      const params: ChangePasswordDto = {
        email: '20522122@gm.uit.edu.vn',
        oldPassword: 'Tuannt02@',
        newPassword: 'Tuannt03@',
      };

      jest.spyOn(service['userRepo'], 'getUserByEmail').mockResolvedValue({
        email: '20522122@gm.uit.edu.vn',
        isMailActive: true, // Accepted all true or false
        password:
          '$2b$10$LA3S1FYXxRiBwHrrpZNdHumOEp0PVsPY43MdW9hpnXRVPLyaoagb.',
        verifyToken: '', // Can be empty string
        createdAt: 1689343792,
        updatedAt: 1689343792,
      });

      jest.spyOn(service['userRepo'], 'updatePassword').mockResolvedValue();

      const res = await service.changePassword(params);
      expect(res).toEqual({
        message: 'Password change successfully',
      });
    });
  });
});
