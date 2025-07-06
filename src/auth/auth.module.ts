import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/users/user.module';
import { HashService } from './services/hash.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService],
  exports: [AuthService],
  imports: [forwardRef(() => UserModule)],
})
export class AuthModule {}
