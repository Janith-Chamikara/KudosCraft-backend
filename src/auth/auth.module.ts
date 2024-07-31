import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './services/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AuthService],
  imports: [UserModule, PrismaModule],
  controllers: [AuthController],
})
export class AuthModule {}
