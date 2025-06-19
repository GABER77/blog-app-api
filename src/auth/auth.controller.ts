import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    // Injecting AuthService
    private readonly authService: AuthService,
  ) {}
}
