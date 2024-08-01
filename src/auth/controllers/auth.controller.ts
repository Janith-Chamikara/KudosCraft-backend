import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { Public } from '../decorators/public.decorator';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Request() req: any) {
    return this.authService.signIn(req.user);
  }
}
