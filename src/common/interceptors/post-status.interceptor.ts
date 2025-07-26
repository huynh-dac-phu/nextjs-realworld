import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CustomStatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(value => {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        if (
          (req.method === 'POST' || req.method === 'PATCH') &&
          [201, 200].includes(res.statusCode)
        ) {
          res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            timestamp: new Date().toISOString(),
            details: { message: value },
          });
        }
      }),
    );
  }
}
