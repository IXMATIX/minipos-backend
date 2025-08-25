import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Between, MoreThanOrEqual } from 'typeorm';

const mockSaleRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
});

const mockUsersService = () => ({
  findById: jest.fn(),
});

describe('SalesService', () => {
  let service: SalesService;
  let salesRepository: ReturnType<typeof mockSaleRepository>;
  let usersService: ReturnType<typeof mockUsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useFactory: mockSaleRepository,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    salesRepository = module.get(getRepositoryToken(Sale));
    usersService = module.get(UsersService);
  });

  it('should create and return a sale', async () => {
    const userId = 1;
    const dto: CreateSaleDto = {
      amount: 5,
      price: 100,
      description: 'test',
      date: new Date().toISOString(),
    };

    const savedSale = { id: 1, ...dto, user_id: userId };

    usersService.findById.mockResolvedValue({ id: userId });
    salesRepository.create.mockReturnValue(savedSale);
    salesRepository.save.mockResolvedValue(savedSale);

    const result = await service.create(dto, userId);

    expect(usersService.findById).toHaveBeenCalledWith(userId);
    expect(salesRepository.create).toHaveBeenCalledWith({
      ...dto,
      user_id: userId,
    });
    expect(salesRepository.save).toHaveBeenCalledWith(savedSale);
    expect(result).toEqual(savedSale);
  });

  it('should return all sales by user', async () => {
    const userId = 1;
    const sales = [{ id: 1, user: { id: userId } }];

    salesRepository.findAndCount.mockResolvedValue([sales, sales.length]);

    const result = await service.findAllByUser({ userId });

    expect(result).toEqual({
      total: sales.length,
      limit: 10,
      offset: 0,
      items: sales,
    });
    expect(salesRepository.findAndCount).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      take: 10,
      skip: 0,
      order: { date: 'DESC' },
    });
  });

  it('should return sales by user filtered by date range', async () => {
    const userId = 1;
    const startDate = '2025-08-01';
    const endDate = '2025-08-08';
    const sales = [{ id: 1, user: { id: userId }, date: '2025-08-05' }];

    salesRepository.findAndCount.mockResolvedValue([sales, sales.length]);

    const result = await service.findAllByUser({ userId, startDate, endDate });

    expect(result).toEqual({
      total: sales.length,
      limit: 10,
      offset: 0,
      items: sales,
    });
    expect(salesRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      take: 10,
      skip: 0,
      order: { date: 'DESC' },
    });
  });

  it('should return sales by user filtered by startDate only', async () => {
    const userId = 1;
    const startDate = '2025-08-01';
    const sales = [{ id: 2, user: { id: userId }, date: '2025-08-02' }];

    salesRepository.findAndCount.mockResolvedValue([sales, sales.length]);

    const result = await service.findAllByUser({ userId, startDate });

    expect(result).toEqual({
      total: sales.length,
      limit: 10,
      offset: 0,
      items: sales,
    });
    expect(salesRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
        date: MoreThanOrEqual(startDate),
      },
      take: 10,
      skip: 0,
      order: { date: 'DESC' },
    });
  });

  it('should return latest sales by user', async () => {
    const userId = 1;
    const limit = 5;
    const sales = [
      { id: 10, date: '2025-08-08', user: { id: userId } },
      { id: 9, date: '2025-08-07', user: { id: userId } },
      { id: 8, date: '2025-08-06', user: { id: userId } },
    ];

    salesRepository.find.mockResolvedValue(sales);

    const result = await service.findLatestByUser(userId, limit);

    expect(result).toEqual(sales);
    expect(salesRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
      take: limit,
    });
  });

  it('should return a sale if found', async () => {
    const sale = { id: 1, user_id: 1 };
    salesRepository.findOne.mockResolvedValue(sale);

    const result = await service.findOne(1, 1);
    expect(result).toEqual(sale);
  });

  it('should throw NotFoundException if sale not found', async () => {
    salesRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('should update and return the sale', async () => {
    const sale = { id: 1, user_id: 1, amount: 5, price: 100 };
    const updatedSale = { ...sale, description: 'updated' };
    const updateDto: UpdateSaleDto = { description: 'updated' };

    salesRepository.findOne.mockResolvedValue(sale);
    salesRepository.save.mockResolvedValue(updatedSale);

    const result = await service.update(1, updateDto, 1);

    expect(result).toEqual(updatedSale);
  });

  it('should remove the sale', async () => {
    const sale = { id: 1, user_id: 1 };
    salesRepository.findOne.mockResolvedValue(sale);
    salesRepository.remove.mockResolvedValue(sale);

    await service.remove(1, 1);

    expect(salesRepository.remove).toHaveBeenCalledWith(sale);
  });
});
