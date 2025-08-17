import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpBody, SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from '@/modules/users/entities/user.entity';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponse } from '@/common/interfaces/user.interface';
import { LoginDto } from './dto/login.dto';

@ApiTags('User')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({
    description: 'User registration details',
    type: SignUpBody,
  })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
    example: {
      accessToken: 'jwt-access-token',
      refreshToken: 'jwt-refresh-token',
    },
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto,
  })
  @ApiCreatedResponse({
    description: 'User logged in successfully.',
    type: UserResponse,
  })
  async signIn(@Req() req: { user: User }): Promise<UserResponse> {
    const { user } = req;
    const data = await this.authService.signIn(user.id.toString());
    return {
      user: data,
    };
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCreatedResponse({
    description: 'Access token refreshed successfully.',
    example: {
      user: {
        accessToken: 'jwt-access-token',
      },
    },
  })
  refreshAccessToken(@Req() req: { user: User }): {
    user: { accessToken: string };
  } {
    const { user } = req;
    const accessToken = this.authService.generateAccessToken({
      userId: user.id.toString(),
    });
    return { user: { accessToken } };
  }
}
