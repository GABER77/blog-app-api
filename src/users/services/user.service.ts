import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandlerFactory } from 'src/common/utils/handler-factory';
import { UpdateUserDto } from '../dto/update-user.dto';
import { uploadImage } from 'src/common/upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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

    return updatedUser;
  }

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    // Check if the user exist
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Upload the image and save the image URL to the user object
    try {
      const imageUrl = await uploadImage(file, userId);
      user.profileImage = imageUrl;
      return this.userRepo.save(user);
    } catch (err) {
      console.error('❌ Image upload failed:', err);
      throw new InternalServerErrorException('Failed to upload profile image');
    }
  }

  async updateUserImageUrl(userId: string, imageUrl: string): Promise<void> {
    // Update only the profileImage field of the user by ID
    await this.userRepo.update(userId, { profileImage: imageUrl });
  }
}
