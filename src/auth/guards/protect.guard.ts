import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/services/user.service';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenService } from '../services/token.service';

// Extend the Request to include cookies (because Express.Request doesn't have it by default)
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if this route is marked public, skip guard if true
    if (this.isPublicRoute(context)) return true;

    // Extract the incoming HTTP request from the context
    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    // 1) Getting the token
    let token: string | undefined;

    // Check for token in the cookie
    if (request.cookies?.access_token) {
      token = request.cookies.access_token;
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
      throw new UnauthorizedException(
        'No access token found, Please login to get access',
      );
    }

    // 2) Verify the Access token
    const decoded = await this.tokenService.verifyAccessToken(token);

    // 3) Check if user still exists: Maybe he deleted his account
    const user = await this.userService.getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException('This user is no longer exists.');
    }

    // 4) Check if the user changed their password after the token was issued
    if (
      user.passwordChangedAt &&
      decoded.iat &&
      decoded.iat <
        Math.floor(new Date(user.passwordChangedAt).getTime() / 1000)
    ) {
      throw new UnauthorizedException(
        'Password was changed recently. Please log in again.',
      );
    }

    // Exclude the hashed password from the returned response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    // All checks passed. Attach user to request for downstream access
    request['user'] = safeUser;

    // Allow the request to proceed to the controller
    return true;
  }

  // Checking @Public() metadata
  private isPublicRoute(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        // Priority order: first check the route handler, then the class
        context.getHandler(), // Gets the method from the controller (e.g., signup())
        context.getClass(), // Gets the controller class itself (e.g., UserController)
      ]) === true
    );
  }
}
