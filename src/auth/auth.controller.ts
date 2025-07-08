import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Validate user and generate a secure JWT cookie
    const result = await this.authService.login(loginDto);

    // If authentication fails, throw an UnauthorizedException
    if (!result?.cookie) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { cookie, user } = result;
    // Set the JWT as cookie in the response object
    res.cookie(cookie.name, cookie.value, cookie.options);
    return user;
  }
}
