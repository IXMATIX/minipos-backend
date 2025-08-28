import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,

    private readonly usersService: UsersService,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: number): Promise<Sale> {
    this.logger.debug(`create sale called — userId=${userId}`);

    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.warn(`create sale failed — userId=${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const sale = this.salesRepository.create({
      ...createSaleDto,
      user_id: userId,
    });

    try {
      const saved = await this.salesRepository.save(sale);
      this.logger.log(`sale created — saleId=${saved.id}, userId=${userId}`);
      return saved;
    } catch (err) {
      this.logger.error(
        `error creating sale — userId=${userId}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  async findAllByUser(params: {
    userId: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) {
    const { userId, startDate, endDate, page = 1, size = 10 } = params;
    this.logger.debug(
      `findAllByUser called — userId=${userId}, startDate=${startDate}, endDate=${endDate}, page=${page}, size=${size}`,
    );

    const where: FindOptionsWhere<Sale> = {
      user: { id: userId },
    };

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.date = LessThanOrEqual(endDate);
    }

    const [items, total] = await this.salesRepository.findAndCount({
      where,
      take: size,
      skip: (page - 1) * size,
      order: { date: 'DESC' },
    });

    const totalPages = Math.ceil(total / size);

    this.logger.debug(
      `findAllByUser results — userId=${userId}, items=${items.length}, total=${total}, totalPages=${totalPages}`,
    );

    return {
      data: items,
      pagination: {
        current_page: page,
        page_size: size,
        total_records: total,
        total_pages: totalPages,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
  }

  async findLatestByUser(userId: number, limit = 10) {
    this.logger.debug(
      `findLatestByUser called — userId=${userId}, limit=${limit}`,
    );
    return this.salesRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
      take: limit,
    });
  }
  async findOne(id: number, userId: number): Promise<Sale> {
    this.logger.debug(`findOne called — id=${id}, userId=${userId}`);
    const sale = await this.salesRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!sale) throw new NotFoundException('Sale not found');
    this.logger.log(`sale found — id=${id}, userId=${userId}`);
    return sale;
  }

  async update(
    id: number,
    updateDto: UpdateSaleDto,
    userId: number,
  ): Promise<Sale> {
    this.logger.debug(`update called — id=${id}, userId=${userId}`);
    const sale = await this.findOne(id, userId);
    Object.assign(sale, updateDto);
    this.logger.log(`sale updated — id=${id}, userId=${userId}`);
    return this.salesRepository.save(sale);
  }

  async remove(id: number, userId: number): Promise<void> {
    this.logger.debug(`remove called — id=${id}, userId=${userId}`);
    const sale = await this.findOne(id, userId);
    this.logger.log(`sale removed — id=${id}, userId=${userId}`);
    await this.salesRepository.remove(sale);
  }
}
