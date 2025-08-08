import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,

    private readonly usersService: UsersService,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: number): Promise<Sale> {
    await this.usersService.findById(userId);

    const sale = this.salesRepository.create({
      ...createSaleDto,
      user_id: userId,
    });
    return this.salesRepository.save(sale);
  }

  async findAllByUser(params: {
    userId: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { userId, startDate, endDate } = params;

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

    return this.salesRepository.find({ where });
  }

  async findOne(id: number, userId: number): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async update(
    id: number,
    updateDto: UpdateSaleDto,
    userId: number,
  ): Promise<Sale> {
    const sale = await this.findOne(id, userId);
    Object.assign(sale, updateDto);
    return this.salesRepository.save(sale);
  }

  async remove(id: number, userId: number): Promise<void> {
    const sale = await this.findOne(id, userId);
    await this.salesRepository.remove(sale);
  }
}
