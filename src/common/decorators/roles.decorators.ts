import { SetMetadata } from '@nestjs/common';

export const ROLES = 'roles';
export const roles = (...roles: string[]) => SetMetadata(ROLES, roles);
