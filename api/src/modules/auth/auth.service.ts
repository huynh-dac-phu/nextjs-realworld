import { hash, compare } from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/users/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@/modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { AuthenticationException } from '@/common/exceptions/error.exception';
import {
  accessTokenPrivateKey,
  refreshTokenPrivateKey,
} from '@/constraints/jwt.constraints';

@Injectable()
export class AuthService {
  private SALT_ROUND = 10;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const isExistEmail = await this.userService.findByEmail(signUpDto.email);
      if (isExistEmail) {
        throw new BadRequestException('Email is existed');
      }

      const hashedPassword = await hash(signUpDto.password, this.SALT_ROUND);
      const newUser = await this.userService.createForAuth({
        ...signUpDto,
        userName: `${signUpDto.email.split('@')[0]}${Math.floor(
          10 + Math.random() * (999 - 10),
        )}`,
        password: hashedPassword,
        bio: '',
        role: 2,
        avatar: '',
        accessToken: '',
        refreshToken: '',
      });
      const accessToken = this.generateAccessToken({
        userId: newUser.id.toString(),
      });
      const refreshToken = this.generateRefreshToken({
        userId: newUser.id.toString(),
      });
      await this.storeRefreshToken(newUser.id.toString(), refreshToken);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signIn(userId: string) {
    try {
      const accessToken = this.generateAccessToken({ userId });
      const refreshToken = this.generateRefreshToken({ userId });
      const user = await this.userService.findById(userId);
      await this.storeRefreshToken(userId, refreshToken);
      return {
        accessToken,
        refreshToken,
        email: user?.email,
        username: user?.user_name,
        bio: user?.bio,
        image: user?.avatar,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findOne({ email });
      await this.verifyPlanContentWithHashedContent(password, user.password);
      return user;
    } catch {
      throw new BadRequestException({
        message: 'Wrong credentials!!',
      });
    }
  }

  async getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    try {
      const user = await this.userService.findOne({ id: Number(userId) });
      await this.verifyPlanContentWithHashedContent(
        refreshToken,
        user.refresh_token,
      );
      return user;
    } catch {
      throw new BadRequestException({
        message: 'Wrong credentials!!',
      });
    }
  }

  private async verifyPlanContentWithHashedContent(
    planText: string,
    hashedText: string,
  ) {
    const isMatching = await compare(planText, hashedText);
    if (!isMatching) {
      throw new AuthenticationException('Password is incorrect');
    }
  }

  generateAccessToken(payload: TokenPayload) {
    try {
      return this.jwtService.sign(payload, {
        algorithm: 'RS256',
        privateKey: accessTokenPrivateKey,
        // secret: this.configService.get<string>('JWT_SCREET_ACCESS_KEY'),
        expiresIn: `${this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}s`,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refreshTokenPrivateKey,
      // secret: this.configService.get<string>('JWT_SCREET_REFRESH_KEY'), // mustchang
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
    try {
      const hashedRefreshToken = await hash(refreshToken, this.SALT_ROUND);
      await this.userService.setCurrentRefreshToken(userId, hashedRefreshToken);
    } catch (error) {
      throw new Error(error);
    }
  }
}
