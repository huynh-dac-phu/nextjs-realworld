import { hash, compare } from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/users/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@/modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';

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
      const isExistEmail = await this.userService.findOne({
        email: signUpDto.email,
      });
      if (isExistEmail) {
        throw new BadRequestException('Email is existed');
      }
      const hashedPassword = await hash(signUpDto.password, this.SALT_ROUND);
      const newUser = await this.userService.create({
        ...signUpDto,
        userName: `${signUpDto.email.split('@')[0]}${Math.floor(
          10 + Math.random() * (999 - 10),
        )}`,
        password: hashedPassword,
        bio: '',
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
      await this.storeRefreshToken(userId, refreshToken);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.verifyPlanContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async verifyPlanContentWithHashedContent(
    planText: string,
    hashedText: string,
  ) {
    const isMatching = await compare(planText, hashedText);
    if (!isMatching) {
      throw new UnauthorizedException('Password is incorrect');
    }
  }

  generateAccessToken(payload: TokenPayload) {
    try {
      return this.jwtService.sign(payload, {
        // algorithm: 'RS256',
        secret: this.configService.get<string>('JWT_SCREET_KEY'),
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
      // algorithm: 'RS256',
      secret: this.configService.get<string>('JWT_SCREET_KEY'), // mustchang
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
