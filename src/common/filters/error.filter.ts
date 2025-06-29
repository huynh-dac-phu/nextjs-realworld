import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class ErrorException implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const config = new ConfigService();
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : '';

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...(config.get('DEVELOPMENT') === 'DEVELOPMENT' && {
        path: req.url,
      }),
      errorDetails: message,
    });
  }
}
