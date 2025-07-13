import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  UnauthorizedException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { HashService } from './hash.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../users/user.entity';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from './token.service';
import {
  RequestWithCookies,
  GoogleUser,
  TokenCookie,
} from '../interfaces/auth-interfaces';
import { MailService } from 'src/mail/services/mail.service';

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{
    cookies: {
      accessTokenCookie: TokenCookie;
      refreshTokenCookie: TokenCookie;
    };
    user: User;
  }> {
    // Check for existing user with same email
    const existing = await this.userService.getUserByEmail(createUserDto.email);
    if (existing) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Check if passwords match
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match.');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await this.hashService.hash(createUserDto.password);

    // Create the new user in the database
    // Replace the plain password with the hashed one
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    // Send welcome email after user is created
    try {
      await this.mailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new RequestTimeoutException('Failed to send welcome email');
    }

    // Create access token and refresh token
    const cookies = await this.tokenService.generateTokensCookies(user.id);

    return { cookies, user };
  }

  async login(loginDto: LoginDto): Promise<{
    cookies: {
      accessTokenCookie: TokenCookie;
      refreshTokenCookie: TokenCookie;
    };
    user: Omit<User, 'password'>;
  } | null> {
    // Check if a user with this email already exists
    const user = await this.userService.getUserByEmail(loginDto.email);
    //If user doesn't exist or If user exists but has no password (signed up via Google)
    //Then treat this as invalid login using email/password
    if (!user || !user.password) return null;

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await this.hashService.compare(
      loginDto.password,
      user.password,
    );

    // If the password does not match, return null (invalid credentials)
    if (!isPasswordMatch) return null;

    // Create access token and refresh token
    const cookies = await this.tokenService.generateTokensCookies(user.id);

    return { cookies, user };
  }

  async refreshToken(req: RequestWithCookies): Promise<string> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided.');
    }

    const decoded = await this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userService.getUserById(decoded.id);
    if (!user) {
      throw new UnauthorizedException('User does not exist.');
    }

    // Only issue a new access token
    return await this.tokenService.createAccessToken(user.id);
  }

  async googleLogin(googleUser: GoogleUser): Promise<{
    cookies: {
      accessTokenCookie: TokenCookie;
      refreshTokenCookie: TokenCookie;
    };
  }> {
    let user = await this.userService.getUserByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.createUser(googleUser);
    }

    const cookies = await this.tokenService.generateTokensCookies(user.id);
    return { cookies };
  }
}
