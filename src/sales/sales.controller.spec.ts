import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { UsersService } from '../users/users.service';

describe('SalesController', () => {
  let controller: SalesController;

  const mockSalesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockSalesService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        { provide: SalesService, useValue: mockSalesService },
        { provide: getRepositoryToken(Sale), useValue: mockSalesRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
