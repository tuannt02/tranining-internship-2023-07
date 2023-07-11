/**
 * custom-error.exception.ts
 * BackEnd
 * Created by khuongdv <khuongdv@vitalify.asia> on 5/10/23
 * Copyright (c) 2023 VFA Asia Co.,Ltd. All rights reserved.
 */
import { CustomError } from '../types';
import { InternalServerErrorException } from '@nestjs/common';

export class CustomErrorException extends InternalServerErrorException {
  readonly code: string;
  readonly statusCode: number;
  readonly message: string;
  constructor(error: CustomError) {
    super(error.message, error.code);
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.message = error.message;
  }

  /**
   * Override and return exactly statusCode
   */
  getStatus() {
    return this.statusCode;
  }

  /**
   * Get response error
   */
  getResponse(): CustomError {
    super.getResponse();
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
