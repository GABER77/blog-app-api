import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  // Injecting Auth Service
  constructor(private readonly authService: AuthService) {}
}
