import { UserModel, User } from '../../models';
import { BaseSeeder } from './base/base.seeder';
import { ISeeder } from './interfaces/seeder.interface';
import users from './data/users.json';

export class UsersSeeder extends BaseSeeder<User> implements ISeeder {
  constructor() {
    super(new UserModel());
  }

  async run() {
    await this.seed(users as User[]);
  }
}
