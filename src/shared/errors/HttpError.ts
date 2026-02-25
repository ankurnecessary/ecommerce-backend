import {
  ERROR_CODES,
  ValidationMessages,
  type ErrorCode
} from '@/shared/config/constants.js';

export class HttpError extends Error {
  statusCode: number;
  code: ErrorCode;
  details?: unknown;

  constructor(
    statusCode: number,
    message: ValidationMessages,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'HttpError';
  }
}
