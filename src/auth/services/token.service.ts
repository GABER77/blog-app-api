import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Create both tokens and return with cookies
  async generateTokensCookies(userId: string): Promise<{
    accessTokenCookie: { name: string; value: string; options: CookieOptions };
    refreshTokenCookie: { name: string; value: string; options: CookieOptions };
  }> {
    const accessToken = await this.createAccessToken(userId);
    const refreshToken = await this.createRefreshToken(userId);

    const accessTokenCookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(
        Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 1000,
      ), // Remove the cookie from the browser after this time
      sameSite: 'lax', // Limits cookie to same-site requests for CSRF protection
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    };

    const refreshTokenCookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_REFRESH_COOKIE_EXPIRES_IN) *
            24 *
            60 *
            60 *
            1000,
      ), // Remove the cookie from the browser after this time
      sameSite: 'lax', // Limits cookie to same-site requests for CSRF protection
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    };

    return {
      accessTokenCookie: {
        name: 'access_token',
        value: accessToken,
        options: accessTokenCookieOptions,
      },
      refreshTokenCookie: {
        name: 'refresh_token',
        value: refreshToken,
        options: refreshTokenCookieOptions,
      },
    };
  }

  // Generate access token
  createAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { id: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  }

  // Generate refresh token
  private createRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { id: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    );
  }

  // Verify Access Token
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  // Verify Refresh Token
  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
