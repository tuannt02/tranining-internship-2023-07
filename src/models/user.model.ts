import { AWSDynamo } from '../config/database/dynamodb';
import { TABLE_NAME } from '../shared/constants';

export type User = {
  email: string;
  password: string;
  is_mail_active: boolean;
  verify_token?: string;
  created_at: number;
  updated_at: number;
};

export class UserModel extends AWSDynamo<User> {
  constructor() {
    super(TABLE_NAME.USERS);
  }
}
