import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  Post,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { HashService } from './hash.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../users/user.entity';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from './token.service';
import { CookieOptions, Request, Response } from 'express';

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Extend the Request to include cookies (because Express.Request doesn't have it by default)
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if a user with this email already exists
    const existing = await this.userService.getUserByEmail(createUserDto.email);
    if (existing) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await this.hashService.hash(createUserDto.password);

    // Create the new user in the database
    // Replace the plain password with the hashed one
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    // Exclude the hashed password from the returned response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async login(loginDto: LoginDto): Promise<{
    cookies: {
      accessTokenCookie: {
        name: string;
        value: string;
        options: CookieOptions;
      };
      refreshTokenCookie: {
        name: string;
        value: string;
        options: CookieOptions;
      };
    };
    user: Omit<User, 'password'>;
  } | null> {
    // Check if a user with this email already exists
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) return null;

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await this.hashService.compare(
      loginDto.password,
      user.password,
    );

    // If the password does not match, return null (invalid credentials)
    if (!isPasswordMatch) return null;

    // Create access token and refresh token
    const cookies = await this.tokenService.generateTokenCookies(user.id);

    // Exclude the hashed password from the returned response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return { cookies, user: safeUser };
  }

  @Post('refresh')
  async refreshToken(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided.');
    }

    let decoded: JwtPayload;
    try {
      decoded = await this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const user = await this.userService.getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException('User does not exist.');
    }

    // ✅ Only issue a new access token
    const accessToken = await this.tokenService.createAccessToken(user.id);

    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(
          Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 60 * 1000,
        ),
      })
      .send({ message: 'Access token refreshed successfully.' });
  }
}
