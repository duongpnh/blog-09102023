import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enums/error-code.enum';
import { ICustomError } from '../interfaces/custom-error.interface';

export const ERROR: Record<ErrorCode, ICustomError> = {
  [ErrorCode.FORBIDDEN_RESOURCE]: {
    message: "You don't have permission to access this resource.",
    description:
      "You don't have permission to access this resource, please contact administrator to address your issue",
    statusCode: HttpStatus.FORBIDDEN,
    serverErrorCode: ErrorCode.FORBIDDEN_RESOURCE,
  },
  [ErrorCode.ACCOUNT_EXISTED]: {
    message: 'Your email address has already existed',
    description: 'Your email address has already existed',
    statusCode: HttpStatus.CONFLICT,
    serverErrorCode: ErrorCode.ACCOUNT_EXISTED,
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    message: 'Your email or password is incorrect',
    description: 'Your email or password is incorrect',
    statusCode: HttpStatus.UNAUTHORIZED,
    serverErrorCode: ErrorCode.INVALID_CREDENTIALS,
  },
  [ErrorCode.TOKEN_EXPIRES]: {
    message: 'Your token is expired',
    description: 'Your token is expired',
    statusCode: HttpStatus.NOT_FOUND,
    serverErrorCode: ErrorCode.TOKEN_EXPIRES,
  },
};
