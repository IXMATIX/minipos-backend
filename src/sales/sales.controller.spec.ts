import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { FilterSalesDto } from './dto/filter-sales.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto';

const mockSalesService = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  findOne: jest.fn(),
  findLatestByUser: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockRequest: RequestWithUser = {
  user: { id: 1, email: 'example@example.com' },
} as RequestWithUser;

describe('SalesController', () => {
  let controller: SalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a sale', async () => {
    const dto: CreateSaleDto = {
      description: 'Test Sale',
      date: '2025-08-08',
      amount: 1,
      price: 100,
    };
    const expected = { id: 1, ...dto };
    mockSalesService.create.mockResolvedValue(expected);

    const result = await controller.create(dto, mockRequest);

    expect(result).toEqual(expected);
    expect(mockSalesService.create).toHaveBeenCalledWith(
      dto,
      mockRequest.user.id,
    );
  });

  it('should return all sales for user with filters', async () => {
    const filter: FilterSalesDto = {
      startDate: '2025-08-01',
      endDate: '2025-08-08',
    };
    const pagination: PaginationDto = {
      limit: 10,
      offset: 0,
    };
    const result = [{ id: 1, total: 100, description: 'Test Sale' }];
    mockSalesService.findAllByUser.mockResolvedValue(result);

    const response = await controller.findAll(mockRequest, filter, pagination);

    expect(response).toEqual(result);
    expect(mockSalesService.findAllByUser).toHaveBeenCalledWith({
      userId: mockRequest.user.id,
      startDate: filter.startDate,
      endDate: filter.endDate,
      limit: pagination.limit,
      offset: pagination.offset,
    });
  });

  it('should return latest sales', async () => {
    const limit = 5;
    const result = [{ id: 1, total: 100, description: 'Latest Sale' }];
    mockSalesService.findLatestByUser.mockResolvedValue(result);

    const response = await controller.getLatestSales(mockRequest, limit);

    expect(response).toEqual(result);
    expect(mockSalesService.findLatestByUser).toHaveBeenCalledWith(
      mockRequest.user.id,
      limit,
    );
  });

  it('should find one sale', async () => {
    const saleId = 1;
    const result = { id: saleId, total: 100, description: 'Test Sale' };
    mockSalesService.findOne.mockResolvedValue(result);

    const response = await controller.findOne(saleId, mockRequest);

    expect(response).toEqual(result);
    expect(mockSalesService.findOne).toHaveBeenCalledWith(
      saleId,
      mockRequest.user.id,
    );
  });

  it('should throw NotFoundException if sale not found', async () => {
    const saleId = 999;
    mockSalesService.findOne.mockRejectedValue(
      new NotFoundException('Sale not found'),
    );

    await expect(controller.findOne(saleId, mockRequest)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockSalesService.findOne).toHaveBeenCalledWith(
      saleId,
      mockRequest.user.id,
    );
  });

  it('should throw ForbiddenException if sale not owned by user', async () => {
    const saleId = 1;
    mockSalesService.findOne.mockRejectedValue(
      new ForbiddenException('You do not have access to this sale'),
    );

    await expect(controller.findOne(saleId, mockRequest)).rejects.toThrow(
      ForbiddenException,
    );
    expect(mockSalesService.findOne).toHaveBeenCalledWith(
      saleId,
      mockRequest.user.id,
    );
  });

  it('should update a sale', async () => {
    const saleId = 1;
    const dto: UpdateSaleDto = { amount: 150 };
    const result = { id: saleId, ...dto };
    mockSalesService.update.mockResolvedValue(result);

    const response = await controller.update(saleId, dto, mockRequest);

    expect(response).toEqual(result);
    expect(mockSalesService.update).toHaveBeenCalledWith(
      saleId,
      dto,
      mockRequest.user.id,
    );
  });

  it('should delete a sale', async () => {
    const saleId = 1;
    mockSalesService.remove.mockResolvedValue(undefined);

    const response = await controller.remove(saleId, mockRequest);

    expect(response).toEqual({ message: 'Sale deleted successfully' });
    expect(mockSalesService.remove).toHaveBeenCalledWith(
      saleId,
      mockRequest.user.id,
    );
  });

  it('should throw NotFoundException on delete if not found', async () => {
    const saleId = 999;
    mockSalesService.remove.mockRejectedValue(
      new NotFoundException('Sale not found'),
    );

    await expect(controller.remove(saleId, mockRequest)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockSalesService.remove).toHaveBeenCalledWith(
      saleId,
      mockRequest.user.id,
    );
  });

  it('should throw ForbiddenException on delete if not owned', async () => {
    const saleId = 1;
    mockSalesService.remove.mockRejectedValue(
      new ForbiddenException('You do not have access to this sale'),
    );

    await expect(controller.remove(saleId, mockRequest)).rejects.toThrow(
      ForbiddenException,
    );
    expect(mockSalesService.remove).toHaveBeenCalledWith(
      saleId,
      mockRequest.user.id,
    );
  });
});
