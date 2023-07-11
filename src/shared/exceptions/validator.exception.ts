/**
 * validator.exception.ts
 * BackEnd
 * Created by khuongdv <khuongdv@vitalify.asia> on 3/16/23
 * Copyright (c) 2023 VFA Asia Co.,Ltd. All rights reserved.
 */
import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(message?: string | object | any, error?: string) {
    super(message, error);
  }
}
