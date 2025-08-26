import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Request } from 'express';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';

const mockExpenseService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findLatestByUser: jest.fn(),
};

const mockRequest = {
  ...({} as Request),
  user: { id: 1, email: 'example@example.com' },
} as RequestWithUser;

describe('ExpensesController', () => {
  let controller: ExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        ExpensesService,
        {
          provide: ExpensesService,
          useValue: mockExpenseService,
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an expense', async () => {
    // ARRANGE
    const fixedDate = new Date('2023-01-01T00:00:00Z');
    const createExpenseDto = {
      total: 100,
      description: 'Test Expense',
      date: '2025-08-20',
    };
    const result = { id: 1, ...createExpenseDto };
    mockExpenseService.create.mockResolvedValue(result);

    // ACT
    const response = await controller.create(createExpenseDto, mockRequest);

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.create).toHaveBeenCalledWith(
      createExpenseDto,
      mockRequest.user.id,
    );
  });

  it('should not create an expense with a user that does not exist', async () => {
    // ARRANGE
    const createExpenseDto = {
      total: 100,
      description: 'Test Expense',
      date: '2025-08-20',
      user: {
        id: 999,
      },
    };

    mockExpenseService.create.mockRejectedValue(
      new NotFoundException('User not found'),
    );

    // ACT & ASSERT
    await expect(
      controller.create(createExpenseDto, mockRequest),
    ).rejects.toThrow(NotFoundException);
    expect(mockExpenseService.create).toHaveBeenCalledWith(
      createExpenseDto,
      mockRequest.user.id,
    );
  });

  it('should return latest expenses', async () => {
    // ARRANGE
    const result = [{ id: 1, total: 100, description: 'Test Expense' }];
    mockExpenseService.findLatestByUser.mockResolvedValue(result);

    // ACT
    const response = await controller.findLatest(mockRequest, 5);

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.findLatestByUser).toHaveBeenCalledWith(
      mockRequest.user.id,
      5,
    );
  });

  it('should return all expenses', async () => {
    // ARRANGE
    const result = [{ id: 1, total: 100, description: 'Test Expense' }];
    mockExpenseService.findAll.mockResolvedValue(result);

    // ACT
    const response = await controller.findAll(
      mockRequest,
      {} as FilterExpenseDto,
      {} as PaginationDto,
    );

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockRequest.user.id,
      }),
    );
  });

  it('should return empty array if no expenses found', async () => {
    // ARRANGE
    mockExpenseService.findAll.mockResolvedValue([]);

    // ACT
    const response = await controller.findAll(
      mockRequest,
      {} as FilterExpenseDto,
      {} as PaginationDto,
    );

    // ASSERT
    expect(response).toEqual([]);
    expect(mockExpenseService.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockRequest.user.id,
      }),
    );
  });

  it('should find an expense by id', async () => {
    // ARRANGE
    const expenseId = 1;
    const result = { id: expenseId, total: 100, description: 'Test Expense' };
    mockExpenseService.findOne.mockResolvedValue(result);

    // ACT
    const response = await controller.findOne(
      expenseId.toString(),
      mockRequest,
    );

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.findOne).toHaveBeenCalledWith(
      expenseId,
      mockRequest.user.id,
    );
  });

  it('should throw NotFoundException if expense not found', async () => {
    // ARRANGE
    const expenseId = 999;
    mockExpenseService.findOne.mockRejectedValue(
      new NotFoundException('Expense not found'),
    );

    // ACT & ASSERT
    await expect(
      controller.findOne(expenseId.toString(), mockRequest),
    ).rejects.toThrow(NotFoundException);
    expect(mockExpenseService.findOne).toHaveBeenCalledWith(
      expenseId,
      mockRequest.user.id,
    );
  });

  it('should throw ForbiddenException if user does not own the expense', async () => {
    // ARRANGE
    const expenseId = 1;
    mockExpenseService.findOne.mockRejectedValue(
      new ForbiddenException('You do not have access to this expense'),
    );

    // ACT & ASSERT
    await expect(
      controller.findOne(expenseId.toString(), mockRequest),
    ).rejects.toThrow(ForbiddenException);
    expect(mockExpenseService.findOne).toHaveBeenCalledWith(
      expenseId,
      mockRequest.user.id,
    );
  });

  it('should update an expense', async () => {
    // ARRANGE
    const expenseId = 1;
    const updateExpenseDto = { total: 150, description: 'Updated Expense' };
    const result = { id: expenseId, ...updateExpenseDto };
    mockExpenseService.update.mockResolvedValue(result);

    // ACT
    const response = await controller.update(
      expenseId.toString(),
      updateExpenseDto,
      mockRequest,
    );

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.update).toHaveBeenCalledWith({
      id: expenseId,
      updateExpenseDto,
      userId: mockRequest.user.id,
    });
  });

  it('should throw NotFoundException when updating non-existent expense', async () => {
    // ARRANGE
    const expenseId = 999;
    const updateExpenseDto = { total: 150, description: 'Updated Expense' };
    mockExpenseService.update.mockRejectedValue(
      new NotFoundException('Expense not found'),
    );

    // ACT & ASSERT
    await expect(
      controller.update(expenseId.toString(), updateExpenseDto, mockRequest),
    ).rejects.toThrow(NotFoundException);
    expect(mockExpenseService.update).toHaveBeenCalledWith({
      id: expenseId,
      updateExpenseDto,
      userId: mockRequest.user.id,
    });
  });

  it('should throw ForbiddenException when updating expense not owned by user', async () => {
    // ARRANGE
    const expenseId = 1;
    const updateExpenseDto = { total: 150, description: 'Updated Expense' };
    mockExpenseService.update.mockRejectedValue(
      new ForbiddenException('You do not have access to this expense'),
    );

    // ACT & ASSERT
    await expect(
      controller.update(expenseId.toString(), updateExpenseDto, mockRequest),
    ).rejects.toThrow(ForbiddenException);
    expect(mockExpenseService.update).toHaveBeenCalledWith({
      id: expenseId,
      updateExpenseDto,
      userId: mockRequest.user.id,
    });
  });

  it('should delete an expense', async () => {
    // ARRANGE
    const expenseId = 1;
    mockExpenseService.remove.mockResolvedValue(undefined);

    // ACT
    const response = await controller.remove(expenseId.toString(), mockRequest);

    // ASSERT
    expect(response).toEqual({ message: 'Expense deleted successfully' });

    expect(mockExpenseService.remove).toHaveBeenCalledWith(
      expenseId,
      mockRequest.user.id,
    );
  });

  it('should throw NotFoundException when deleting non-existent expense', async () => {
    // ARRANGE
    const expenseId = 999;
    mockExpenseService.remove.mockRejectedValue(
      new NotFoundException('Expense not found'),
    );

    // ACT & ASSERT
    await expect(
      controller.remove(expenseId.toString(), mockRequest),
    ).rejects.toThrow(NotFoundException);
    expect(mockExpenseService.remove).toHaveBeenCalledWith(
      expenseId,
      mockRequest.user.id,
    );
  });

  it('should throw ForbiddenException when deleting expense not owned by user', async () => {
    // ARRANGE
    const expenseId = 1;
    mockExpenseService.remove.mockRejectedValue(
      new ForbiddenException('You do not have access to this expense'),
    );

    // ACT & ASSERT
    await expect(
      controller.remove(expenseId.toString(), mockRequest),
    ).rejects.toThrow(ForbiddenException);
    expect(mockExpenseService.remove).toHaveBeenCalledWith(
      expenseId,
      mockRequest.user.id,
    );
  });

  it('should filter expenses by date', async () => {
    // ARRANGE
    const filterDto: FilterExpenseDto = {
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    };
    const pagination: PaginationDto = { page: 1, size: 10 };
    const result = [{ id: 1, total: 100, description: 'Test Expense' }];
    mockExpenseService.findAll.mockResolvedValue(result);

    // ACT
    const response = await controller.findAll(
      mockRequest,
      filterDto,
      pagination,
    );

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.findAll).toHaveBeenCalledWith({
      userId: mockRequest.user.id,
      startDate: filterDto.startDate,
      endDate: filterDto.endDate,
      page: pagination.page,
      size: pagination.size,
    });
  });

  it('should filter expenses by start date only', async () => {
    // ARRANGE
    const filterDto: FilterExpenseDto = {
      startDate: '2023-01-01',
    };
    const pagination: PaginationDto = { page: 1, size: 10 };
    const result = [{ id: 1, total: 100, description: 'Test Expense' }];
    mockExpenseService.findAll.mockResolvedValue(result);

    // ACT
    const response = await controller.findAll(
      mockRequest,
      filterDto,
      pagination,
    );

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.findAll).toHaveBeenCalledWith({
      userId: mockRequest.user.id,
      startDate: filterDto.startDate,
      page: pagination.page,
      size: pagination.size,
    });
  });
  it('should filter expenses by end date only', async () => {
    // ARRANGE
    const filterDto: FilterExpenseDto = {
      endDate: '2023-01-31',
    };
    const pagination: PaginationDto = { page: 1, size: 10 };
    const result = [{ id: 1, total: 100, description: 'Test Expense' }];
    mockExpenseService.findAll.mockResolvedValue(result);

    // ACT
    const response = await controller.findAll(
      mockRequest,
      filterDto,
      pagination,
    );

    // ASSERT
    expect(response).toEqual(result);
    expect(mockExpenseService.findAll).toHaveBeenCalledWith({
      userId: mockRequest.user.id,
      endDate: filterDto.endDate,
      page: pagination.page,
      size: pagination.size,
    });
  });
});
