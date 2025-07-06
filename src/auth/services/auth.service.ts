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

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if a user with this email already exists
    const existing = await this.userService.getUserByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await this.hashService.hash(dto.password);

    // Create the new user in the database
    // Replace the plain password with the hashed one
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    // Exclude the hashed password from the returned response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
