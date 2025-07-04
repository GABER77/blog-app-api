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
import { QueryDto } from 'src/common/dto/query.dto';

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

  public async getAllUsers(queryDto: QueryDto) {
    // Create a query builder for the entity
    const qb = this.userRepo.createQueryBuilder('user');

    // Apply a chain of query features
    const modifiedQuery = new QueryBuilderService(qb, queryDto, 'user')
      .filter()
      .search(['name', 'email']) // searchable fields
      .sort()
      .limitFields()
      .paginate()
      .getQuery();

    // 'users' Get paginated + filtered users
    // 'total' number of users matching the filters (ignores pagination)
    const [users, total] = await modifiedQuery.getManyAndCount();

    // Calculate the total number of pages based on total records
    const totalPages = Math.ceil(total / queryDto.limit!);

    return {
      total,
      retrieved: users.length,
      page: queryDto.page,
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
