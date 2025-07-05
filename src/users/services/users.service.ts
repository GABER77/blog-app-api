import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HandlerFactory } from 'src/common/utils/handler-factory';

@Injectable()
export class UsersService {
  constructor(
    // Injecting User Repository
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    // Injecting AuthService using Circular Dependency
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async createUser(dto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // Create and save new user
    const newUser = this.userRepo.create(dto);
    return await this.userRepo.save(newUser);
  }

  public async getAllUsers(query: Record<string, string>) {
    return HandlerFactory.getAll({
      repo: this.userRepo,
      queryParams: query,
      alias: 'user',
      searchableFields: ['name', 'email'],
    });
  }

  public async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return user;
  }
}
