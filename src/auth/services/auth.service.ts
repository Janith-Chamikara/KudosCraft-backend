import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { getHasedPassword } from 'src/utils/get-hashed-password';
import { comparePassword } from 'src/utils/compare-password';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(signUpDto: SignUpDto) {
    const { password, email } = signUpDto;
    const hashedPassword = await getHasedPassword(password);
    if (!hashedPassword) {
      throw new HttpException(
        'Cannot hash the given password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isUserExists = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (isUserExists) {
      throw new HttpException(
        'The email provided is already in use. Try again with another email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prismaService.user.create({
      data: { ...signUpDto, password: hashedPassword },
    });
    if (!user) {
      throw new HttpException(
        'Error happend while creating your account.Try again later.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async login(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const isUserExists = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!password || !email) {
      throw new HttpException(
        'Password and email are required.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordCorrect = await comparePassword(
      password,
      (isUserExists as SignInDto).password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException('Invalid password!', HttpStatus.UNAUTHORIZED);
    }
    return isUserExists && isPasswordCorrect;
  }
}
