import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }

  async createCookie(userId: string): Promise<{
    name: string;
    value: string;
    options: CookieOptions;
  }> {
    const token = await this.createToken(userId);

    const cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
      ), // Remove the cookie from the browser after this time
      httpOnly: true,
      sameSite: 'lax', // Limits cookie to same-site requests for CSRF protection
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    };

    return {
      name: 'JWT',
      value: token,
      options: cookieOptions,
    };
  }
}
