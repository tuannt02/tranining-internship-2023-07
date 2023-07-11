import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validator.exception';
import { ERRORS } from '../constants';
import { CustomErrorException } from '../exceptions/custom-error.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Override for custom error handling
   *
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, message, statusCode } = this.formatError(exception);
    const errorResponse = {
      code: code,
      message: message,
    };

    response.status(statusCode).send(errorResponse);
  }

  /**
   * Get error code from exception
   *
   * @protected
   */
  protected formatError(e: HttpException | ValidationException): {
    message: string;
    code: string;
    statusCode: number;
  } {
    if (e instanceof CustomErrorException) {
      return e.getResponse();
    }
    let code = '';
    if (e instanceof ValidationException) {
      code = e.getResponse()['error'] ?? '';
    }
    switch (code) {
      case 'email': {
        return ERRORS.InvalidEmail;
      }
      case 'password': {
        return ERRORS.InvalidPassword;
      }
      default:
        return ERRORS.InternalServerError;
    }
  }
}
