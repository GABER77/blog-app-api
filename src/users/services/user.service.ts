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
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { HandlerFactory } from 'src/common/utils/handler-factory';

@Injectable()
export class UserService {
  constructor(
    // Injecting User Repository
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    // Injecting AuthService using Circular Dependency
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  public async getAllUsers(query: Record<string, string>) {
    return HandlerFactory.getAll({
      repo: this.userRepo,
      queryParams: query,
      alias: 'user',
      searchableFields: ['name', 'email'],
    });
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return user;
  }
}
