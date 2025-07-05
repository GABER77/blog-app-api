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
import { QueryBuilderService } from 'src/common/utils/query-builder.service';

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
    // Parse pagination parameters with fallback
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    // Create a query builder for the entity
    const qb = this.userRepo.createQueryBuilder('user');

    // Apply a chain of query features
    const modifiedQuery = new QueryBuilderService(qb, query, 'user')
      .filter()
      .search(['name', 'email']) // searchable fields
      .sort()
      .limitFields()
      .paginate(page, limit)
      .getQuery();

    // 'users' Get paginated + filtered users
    // 'total' number of users matching the filters (ignores pagination)
    const [users, total] = await modifiedQuery.getManyAndCount();

    // Calculate the total number of pages based on total records
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      retrieved: users.length,
      page,
      totalPages,
      users,
    };
  }

  public async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return user;
  }
}
