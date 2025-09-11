import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@/modules/auth/interfaces/token.interface';
import { AuthService } from '@/modules/auth/auth.service';
import { refreshTokenPublicKey } from '@/constraints/jwt.constraints';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refreshTokenPublicKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const authHeader: string = req.headers?.['authorization'];
    const token = authHeader?.split('Bearer ')[1];

    return await this.authService.getUserIfRefreshTokenMatched(
      payload.userId,
      token || '',
    );
  }
}
