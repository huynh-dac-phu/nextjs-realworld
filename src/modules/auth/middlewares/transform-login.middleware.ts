// transform-login.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TransformLoginMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const body = req.body as {
      user?: { email: string; password: string };
    };

    if (body.user) {
      body['email'] = body.user.email;
      body['password'] = body.user.password;
    }
    next();
  }
}
