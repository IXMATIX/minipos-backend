import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  sales: [],
  expenses: [],
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      repository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return user without password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'plaintext',
      };

      const hashedPassword = 'hashed';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const createdUser = {
        ...mockUser,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.create.mockReturnValue(createdUser as User);
      repository.save.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toMatchObject({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      });

      expect((result as User).password).toBeUndefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'duplicate@example.com',
        password: 'password',
      };

      repository.create.mockReturnValue(mockUser);
      repository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException on unexpected DB error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'error@example.com',
        password: 'password',
      };

      repository.create.mockReturnValue(mockUser);
      repository.save.mockRejectedValue(new Error('Unexpected'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
