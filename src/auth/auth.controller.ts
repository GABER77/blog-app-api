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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { RequestWithCookies } from './interfaces/auth-interfaces';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RequestWithUser } from './interfaces/auth-interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Register the user and get back tokens and user object
    const result = await this.authService.signup(createUserDto);

    const { cookies, user } = result;

    // Set the access & refresh tokens as HTTP-only cookies
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
      );
    return user;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Validate user and get back tokens and user object
    const result = await this.authService.login(loginDto);

    // If authentication fails, throw an UnauthorizedException
    if (!result) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { cookies, user } = result;

    // Set the access & refresh tokens as HTTP-only cookies
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
      );
    return user;
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

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Passport takes care of redirecting to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard) // This Guard calls your validate() method to build the user object and attach it to the request
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { cookies } = await this.authService.googleLogin(req.user);
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
      .redirect(process.env.GOOGLE_SUCCESS_REDIRECT || '/');
  }
}
