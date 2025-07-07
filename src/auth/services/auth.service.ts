import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { HashService } from './hash.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../../users/user.entity';
import { LoginDto } from '../dto/login.dto';
import { TokenService } from './token.service';
import { CookieOptions } from 'express';

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
    cookie: { name: string; value: string; options: CookieOptions };
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

    // Create secure JWT cookie
    const cookie = await this.tokenService.createCookie(user.id);

    // Exclude the hashed password from the returned response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return { cookie, user: safeUser };
  }
}
