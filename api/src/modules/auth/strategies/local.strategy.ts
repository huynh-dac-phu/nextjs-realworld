import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthenticationException } from '@/common/exceptions/error.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.getAuthenticatedUser(email, password);
    if (!user) {
      throw new AuthenticationException();
    }
    return user;
  }
}
