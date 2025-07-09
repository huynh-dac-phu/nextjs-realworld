import { UserService } from '@/modules/users/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@/modules/auth/interfaces/token.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const configService = new ConfigService();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SCREET_KEY') || '',
    });
  }

  async validate(payload: TokenPayload) {
    return await this.userService.findOne({ id: Number(payload.userId) });
  }
}
