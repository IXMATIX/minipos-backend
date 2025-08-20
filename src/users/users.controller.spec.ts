import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Partial<UsersService>;

  beforeEach(async () => {
    const mockUsersService: Partial<jest.Mocked<UsersService>> = {
      findById: jest.fn(),
      create: jest.fn(),
    };

    const mockAuthService: Partial<jest.Mocked<AuthService>> = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService }, // 👈 necesario
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should return the current user', async () => {
    const mockRequest: { user: { id: string } } = {
      user: { id: '1' },
    };

    const mockUser = {
      id: 1,
      email: 'user@example.com',
    };

    if (!service.findById) throw new Error('findById is not defined');
    (service.findById as jest.Mock).mockResolvedValueOnce(mockUser);

    const result = await controller.getCurrentUser(mockRequest);

    expect(result).toEqual(
      expect.objectContaining({
        id: 1,
        email: 'user@example.com',
      }),
    );
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if user not found', async () => {
    const mockRequest: { user: { id: string } } = {
      user: { id: '999' },
    };

    if (!service.findById) throw new Error('findById is not defined');
    (service.findById as jest.Mock).mockRejectedValueOnce(
      new NotFoundException('User with ID 999 not found'),
    );

    await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow(
      NotFoundException,
    );
    expect(service.findById).toHaveBeenCalledWith(999);
  });
});
