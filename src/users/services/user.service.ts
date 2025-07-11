import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandlerFactory } from 'src/common/utils/handler-factory';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getAllUsers(query: Record<string, string>) {
    return HandlerFactory.getAll({
      repo: this.userRepo,
      queryParams: query,
      alias: 'user',
      searchableFields: ['name', 'email'],
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found.`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // Find the user by ID
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Apply and save only the provided fields from updateUserDto to the user entity
    Object.assign(user, updateUserDto);
    await this.userRepo.save(user);

    // Reload the user to get all fields freshly from the database
    const updatedUser = await this.userRepo.findOne({ where: { id } });
    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Failed to reload user after update',
      );
    }

    // Exclude the hashed password from the returned response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }
}
