import { dateToTimestamp } from 'src/shared/utils/date.utils';
import { UserModel, User } from '../models/user.model';
import * as bcrypt from 'bcrypt';

export class UserRepository {
  private readonly model = new UserModel();

  /**
   * Create user
   *
   * @param user
   */
  async createUser(
    user: Pick<User, 'email' | 'password' | 'verifyToken'>,
  ): Promise<void> {
    const hashedPassword = await this.hashPassword(user.password);
    const timestamp = dateToTimestamp();

    return this.model.create({
      email: user.email,
      verifyToken: user.verifyToken,
      password: hashedPassword,
      isMailActive: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const timestamp = dateToTimestamp();

    const key = {
      email,
    };

    const values: Partial<User> = {
      password: await this.hashPassword(newPassword),
      updatedAt: timestamp,
    };

    return this.model.update(key, values);
  }

  /**
   * Save token
   *
   * @param password
   * @param token
   */
  async saveVerifyToken(email: string, token: string): Promise<void> {
    const timestamp = dateToTimestamp();
    const key = {
      email,
    };
    const values: Partial<User> = {
      verifyToken: token,
      updatedAt: timestamp,
    };

    return this.model.update(key, values);
  }

  /**
   * Save token
   *
   * @param password
   * @param token
   */
  async saveForgetPasswordToken(email: string, token: string): Promise<void> {
    const timestamp = dateToTimestamp();

    const key = {
      email,
    };

    const values: Partial<User> = {
      forgotPwToken: token,
      updatedAt: timestamp,
    };

    return this.model.update(key, values);
  }

  /**
   * Verify success
   *
   * @param password
   */
  async verifySuccess(email: string): Promise<void> {
    const key = {
      email,
    };

    const values: Partial<User> = {
      verifyToken: '',
      isMailActive: true,
    };

    this.model.update(key, values);
  }

  /**
   * Hash password
   *
   * @param password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  /**
   * Unhash & check password
   *
   * @param password
   * @param hashedPassword
   */
  async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Get user by email
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<User> {
    const key = {
      email,
    };

    return this.model.get(key);
  }
}
