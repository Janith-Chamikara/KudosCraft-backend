import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { getHasedPassword } from 'src/utils/get-hashed-password';
import { comparePassword } from 'src/utils/compare-password';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, email } = signUpDto;
    const hashedPassword = await getHasedPassword(password);
    if (!hashedPassword) {
      throw new BadRequestException('Cannot hash the given password');
    }
    const isUserExists = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (isUserExists) {
      throw new BadRequestException(
        'The email provided is already in use. Try again with another email',
      );
    }
    const user = await this.prismaService.user.create({
      data: { ...signUpDto, password: hashedPassword },
    });
    if (!user) {
      throw new BadRequestException(
        'Error happend while creating your account.Try again later.',
      );
    }
    return this.signIn(user);
  }

  async signIn(user: Omit<User, 'password'>) {
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const isUserExists = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!isUserExists) {
      throw new BadRequestException('Invalid email.');
    }
    const isPasswordCorrect = await comparePassword(
      password,
      isUserExists.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }
    if (isUserExists && isPasswordCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = isUserExists;
      return result;
    }
    return null;
  }

  generateRefreshToken(payload: Omit<User, 'password'>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: parseInt(
        this.configService.getOrThrow('REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC'),
      ),
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'), // Replace with your secret key
    });
    const user = await this.prismaService.user.findUnique(decoded.email);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
