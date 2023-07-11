import { CustomError } from '../types/errors.type';

type Code =
  | 'InternalServerError'
  | 'DBInsert'
  | 'DBUpdate'
  | 'DBQuery'
  | 'DBDelete'
  | 'InvalidEmail'
  | 'InvalidPassword'
  | 'EmailExisted';

export const ERRORS: Record<Code, CustomError> = {
  InternalServerError: {
    code: 'A00001',
    message: 'Internal server error',
    statusCode: 500,
  },
  DBInsert: {
    code: 'A00002',
    message: 'Cannot insert data to database',
    statusCode: 500,
  },
  DBUpdate: {
    code: 'A00003',
    message: 'Cannot update data to database',
    statusCode: 500,
  },
  DBQuery: {
    code: 'A00004',
    message: 'Cannot query data in database',
    statusCode: 500,
  },
  DBDelete: {
    code: 'A00005',
    message: 'Cannot delete data in database',
    statusCode: 500,
  },
  InvalidEmail: {
    code: 'B00001',
    message: 'Invalid input emai',
    statusCode: 400,
  },
  InvalidPassword: {
    code: 'B00002',
    message: 'Invalid input password',
    statusCode: 400,
  },
  EmailExisted: {
    code: 'B00003',
    message: 'Email is already existed',
    statusCode: 409,
  },
};
