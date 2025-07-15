import { UserService } from '@/modules/users/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@/modules/auth/interfaces/token.interface';
import { accessTokenPublicKey } from '@/constraints/jwt.constraints';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessTokenPublicKey,
    });
  }

  async validate(payload: TokenPayload) {
    return await this.userService.getUserWithRole(Number(payload.userId));
  }
}
