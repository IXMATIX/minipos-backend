import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseExpenseDto } from './dto/response-expense.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

const mockExpenseRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  findOneBy: jest.fn(),
};

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockExpenseRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return the new expense', async () => {
    const dto = { total: 100, description: 'Test Expense', date: new Date() };
    const user = { id: 1, email: 'test@example.com' };
    const savedExpense = { id: 10, ...dto, user };

    mockUserRepository.findOneBy.mockResolvedValue(user);
    mockExpenseRepository.create.mockReturnValue({ ...dto, user });
    mockExpenseRepository.save.mockResolvedValue(savedExpense);

    const result = await service.create(dto, 1);

    expect(result).toEqual(
      plainToInstance(ResponseExpenseDto, {
        ...savedExpense,
        user_id: user.id,
      }),
    );

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockExpenseRepository.create).toHaveBeenCalledWith({ ...dto, user });
    expect(mockExpenseRepository.save).toHaveBeenCalledWith({ ...dto, user });
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create(
        { total: 100, description: 'Test Expense', date: new Date() },
        999,
      ),
    ).rejects.toThrow(NotFoundException);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
  });

  it('should return all expenses', async () => {
    const result = [{ id: 1, amount: 100, description: 'Test Expense' }];
    mockExpenseRepository.find.mockResolvedValue(result);

    expect(await service.findAll({ userId: 1 })).toEqual(result);
    expect(mockExpenseRepository.find).toHaveBeenCalled();
  });

  it('should return empty array if user has no expenses', async () => {
    mockExpenseRepository.find.mockResolvedValue([]);
    const result = await service.findAll({ userId: 999 });
    expect(result).toEqual([]);
    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 999 } },
    });
  });

  it('should return empty array if another user has no expenses', async () => {
    mockExpenseRepository.find.mockResolvedValue([]);
    const result = await service.findAll({ userId: 2 });
    expect(result).toEqual([]);
    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 2 } },
    });
  });

  it('should return the expense if it belongs to the user', async () => {
    const expense = { id: 1, total: 100, user: { id: 1 } };
    service['validateOwnership'] = jest.fn().mockResolvedValue(expense);
    const result = await service.findOne(1, 1);
    expect(result).toEqual(expense);
    expect(service['validateOwnership']).toHaveBeenCalledWith(1, 1);
  });

  // Uncomment this test when the validateOwnership method is implemented
  // it('should return the expense if it belongs to the user', async () => {
  //   const expense = { id: 1, total: 100, user: { id: 1 } };
  //   mockExpenseRepository.findOne.mockResolvedValue(expense);
  //   const result = await service.findOne(1, 1);
  //   expect(result).toEqual(expense);
  //   expect(mockExpenseRepository.findOne).toHaveBeenCalledWith({
  //     where: { id: 1 },
  //     relations: ['user'],
  //   });
  // });

  it('should throw NotFoundException if expense does not exist', async () => {
    service['validateOwnership'] = jest.fn().mockImplementation(() => {
      throw new NotFoundException('Expense not found');
    });
    await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if expense belongs to another user', async () => {
    service['validateOwnership'] = jest.fn().mockImplementation(() => {
      throw new ForbiddenException('Access denied');
    });

    await expect(service.findOne(1, 999)).rejects.toThrow(ForbiddenException);
  });

  it('should update the expense if it belongs to the user', async () => {
    const expense = { id: 1, total: 100, description: 'Old', user: { id: 1 } };
    const updateExpenseDto = { total: 200, description: 'Updated' };

    service['validateOwnership'] = jest.fn().mockResolvedValue(expense);
    mockExpenseRepository.save.mockResolvedValue({
      ...expense,
      ...updateExpenseDto,
    });

    const result = await service.update({
      id: 1,
      updateExpenseDto,
      userId: 1,
    });

    expect(service['validateOwnership']).toHaveBeenCalledWith(1, 1);
    expect(mockExpenseRepository.save).toHaveBeenCalledWith({
      ...expense,
      ...updateExpenseDto,
    });
    expect(result).toEqual({ ...expense, ...updateExpenseDto });
  });

  it('should delete the expense if it belongs to the user', async () => {
    service['validateOwnership'] = jest.fn().mockResolvedValue({ id: 1 });
    mockExpenseRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1, 1);

    expect(service['validateOwnership']).toHaveBeenCalledWith(1, 1);
    expect(mockExpenseRepository.delete).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw if the expense does not belong to the user', async () => {
    service['validateOwnership'] = jest
      .fn()
      .mockRejectedValue(new ForbiddenException('Forbidden'));

    await expect(service.remove(99, 123)).rejects.toThrow(ForbiddenException);

    expect(service['validateOwnership']).toHaveBeenCalledWith(99, 123);
    expect(mockExpenseRepository.delete).not.toHaveBeenCalled();
  });

  it('should return latest expenses by user', async () => {
    const userId = 1;
    const limit = 5;
    const expenses = [
      { id: 10, date: '2025-08-08', user: { id: userId } },
      { id: 9, date: '2025-08-07', user: { id: userId } },
      { id: 8, date: '2025-08-06', user: { id: userId } },
    ];

    mockExpenseRepository.find.mockResolvedValue(expenses);

    const result = await service.findLatestByUser(userId, limit);

    expect(result).toEqual(expenses);
    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
      take: limit,
    });
  });

  it('should filter expenses by date range', async () => {
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';
    const userId = 1;
    const expenses = [
      { id: 1, date: new Date('2023-01-15'), user: { id: userId } },
      { id: 2, date: new Date('2023-01-20'), user: { id: userId } },
    ];

    mockExpenseRepository.find.mockResolvedValue(expenses);

    const result = await service.findAll({
      userId,
      startDate,
      endDate,
    });

    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
        date: Between(new Date(startDate), new Date(endDate)),
      },
    });
    expect(result).toEqual(expenses);
  });

  it('should filter expenses by start date', async () => {
    const startDate = '2023-01-01';
    const userId = 1;
    const expenses = [
      { id: 1, date: new Date('2023-01-15'), user: { id: userId } },
      { id: 2, date: new Date('2023-01-20'), user: { id: userId } },
    ];

    mockExpenseRepository.find.mockResolvedValue(expenses);

    const result = await service.findAll({
      userId,
      startDate,
    });

    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
        date: MoreThanOrEqual(new Date(startDate)),
      },
    });
    expect(result).toEqual(expenses);
  });

  it('should filter expenses by end date', async () => {
    const endDate = '2023-01-31';
    const userId = 1;
    const expenses = [
      { id: 1, date: new Date('2023-01-15'), user: { id: userId } },
      { id: 2, date: new Date('2023-01-20'), user: { id: userId } },
    ];

    mockExpenseRepository.find.mockResolvedValue(expenses);

    const result = await service.findAll({
      userId,
      endDate,
    });

    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
        date: LessThanOrEqual(new Date(endDate)),
      },
    });
    expect(result).toEqual(expenses);
  });

  it('should filter with invalid date range', async () => {
    const startDate = '2023-01-31';
    const endDate = '2023-01-01';
    const userId = 1;

    mockExpenseRepository.find.mockResolvedValue([]);

    const result = await service.findAll({
      userId,
      startDate,
      endDate,
    });

    expect(mockExpenseRepository.find).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
        date: Between(new Date(startDate), new Date(endDate)),
      },
    });
    expect(result).toEqual([]);
  });
});
