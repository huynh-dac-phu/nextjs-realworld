import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@/modules/auth/interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(private readonly authService: AuthService) {
    const configService = new ConfigService();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SCREET_REFRESH_KEY') || '',
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
