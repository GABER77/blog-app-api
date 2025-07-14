import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { HashService } from './services/hash.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService, TokenService, GoogleStrategy],
  exports: [AuthService, JwtModule, TokenService],
  imports: [UserModule, JwtModule],
})
export class AuthModule {}
