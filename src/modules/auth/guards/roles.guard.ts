import { ROLES } from '@/common/decorators/roles.decorators';
import { RequestWithUser } from '@/types/request.type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const req: RequestWithUser = ctx.switchToHttp().getRequest();
    const role = req.user.role.name;
    return roles.includes(role);
  }
}
