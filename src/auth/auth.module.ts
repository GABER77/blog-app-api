import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/users/user.module';
import { HashService } from './services/hash.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService, TokenService],
  exports: [AuthService, JwtModule, TokenService],
  imports: [forwardRef(() => UserModule), JwtModule],
})
export class AuthModule {}
