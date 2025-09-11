import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_: any, user: TUser): TUser | null {
    return user instanceof User ? (user as TUser) : null;
  }
}
