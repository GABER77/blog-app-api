import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/services/user.service';
import { Request } from 'express';

// Extend the Request to include cookies (because Express.Request doesn't have it by default)
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the incoming HTTP request from the context
    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    // 1) Getting the token
    let token: string | undefined;

    // Check for token in the cookie
    if (request.cookies?.jwt) {
      token = request.cookies.jwt;
    }
    // If no cookie token is found, fallback to Bearer token in Authorization header
    else if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }

    // If no token is found, deny access
    if (!token) {
      throw new UnauthorizedException('Please login to get access');
    }

    // 2) Verify the token using the secret from environment
    let decoded: { id: string; iat: number; exp: number };
    try {
      decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Token is invalid or expired.');
    }

    // 3) Check if user still exists: Maybe he deleted his account
    const user = await this.userService.getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException('This user is no longer exists.');
    }

    // 4) Check if the user changed their password after the token was issued
    if (
      user.passwordChangedAt &&
      decoded.iat <
        Math.floor(new Date(user.passwordChangedAt).getTime() / 1000)
    ) {
      throw new UnauthorizedException(
        'Password was changed recently. Please log in again.',
      );
    }

    // All checks passed. Attach user to request for downstream access
    request['user'] = user;

    // Allow the request to proceed to the controller
    return true;
  }
}
