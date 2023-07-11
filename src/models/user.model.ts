import { AWSDynamo } from '../config/database/dynamodb';
import { TABLE_NAME } from '../shared/constants';

export type User = {
  email: string;
  password: string;
  isMailActive: boolean;
  verifyToken: string;
  createdAt: number;
  updatedAt: number;
};

export class UserModel extends AWSDynamo<User> {
  constructor() {
    super(TABLE_NAME.USERS);
  }
}
