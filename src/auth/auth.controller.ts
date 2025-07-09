import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RequestWithCookies } from '../common/interfaces/request-with-cookies.interface';

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
    if (!result) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { cookies, user } = result;
    // Set the cookies in the response object
    res
      .cookie(
        cookies.accessTokenCookie.name,
        cookies.accessTokenCookie.value,
        cookies.accessTokenCookie.options,
      )
      .cookie(
        cookies.refreshTokenCookie.name,
        cookies.refreshTokenCookie.value,
        cookies.refreshTokenCookie.options,
      )
      .send({ user });
  }

  @Public()
  @Get('refresh-token')
  async refreshToken(@Req() req: RequestWithCookies, @Res() res: Response) {
    const accessToken = await this.authService.refreshToken(req);

    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(
          Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 1000,
        ),
      })
      .send({ message: 'Access token refreshed successfully.' });
  }
}
