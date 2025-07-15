import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

// Utility to mock the TypeORM repository methods
// Because we don't want to run real DB queries
// Just simulate what the DB would do
const mockUserRepo = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let mockedRepo: jest.Mocked<Repository<User>>;

  // Creating a testing environment (a mini NestJS app)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockedRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const user = { id: '123', email: 'test@test.com' } as User;
      // You tell the mock repo to return user when findOneBy() is called
      mockedRepo.findOneBy.mockResolvedValueOnce(user);

      // Calls your real service method, which uses the mocked repo
      const result = await service.getUserById('123');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockedRepo.findOneBy.mockResolvedValueOnce(null);

      await expect(service.getUserById('123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return the updated user', async () => {
      const userId = '1';
      const updateData = { name: 'Updated Name' };
      const existingUser = { id: userId, name: 'Old Name' } as User;
      const updatedUser = { id: userId, name: 'Updated Name' } as User;

      // Simulate finding the user and saving changes
      mockedRepo.findOne.mockResolvedValueOnce(existingUser); // For existence check
      mockedRepo.save.mockResolvedValueOnce(updatedUser);
      mockedRepo.findOne.mockResolvedValueOnce(updatedUser); // For final return

      const result = await service.updateUser(userId, updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockedRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.updateUser('123', { name: 'John' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
