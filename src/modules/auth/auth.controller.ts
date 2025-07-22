import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from '@/modules/users/entities/user.entity';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() req: { user: User }) {
    const { user } = req;
    const token = await this.authService.signIn(user.id.toString());
    return {
      data: token,
    };
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  refreshAccessToken(@Req() req: { user: User }): {
    data: { accessToken: string };
  } {
    const { user } = req;
    const accessToken = this.authService.generateAccessToken({
      userId: user.id.toString(),
    });
    return { data: { accessToken } };
  }
}
