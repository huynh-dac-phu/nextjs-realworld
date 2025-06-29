import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: number,
    public readonly messageCode?: string,
    public readonly details?: any,
  ) {
    super(
      {
        message,
        messageCode,
        details,
      },
      statusCode,
    );
  }
}

export class ValidationException extends AppException {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class ResourceNotFoundException extends AppException {
  constructor(resourceType: string, identifier: string | number) {
    const message = `${resourceType} with ID ${identifier} not found`;
    super(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND');
  }
}

export class AuthenticationException extends AppException {
  constructor(message: string = 'Authentication failed!') {
    super(message, HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
  }
}
