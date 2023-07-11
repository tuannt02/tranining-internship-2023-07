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
  async createUser(user: Pick<User, 'email' | 'password'>): Promise<void> {
    const hashedPassword = await this.hashPassword(user.password);
    const timestamp = dateToTimestamp();

    return this.model.create({
      email: user.email,
      password: hashedPassword,
      is_mail_active: false,
      created_at: timestamp,
      updated_at: timestamp,
    });
  }

  async saveToken(email: string, token: string): Promise<void> {
    const timestamp = dateToTimestamp();
    const key = {
      email,
    };
    const values: Partial<User> = {
      verify_token: token,
      updated_at: timestamp,
    };

    return this.model.update(key, values);
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
