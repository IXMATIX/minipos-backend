import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponseExpenseDto } from './dto/response-expense.dto';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    this.logger.debug(`create expense called — userId=${userId}`);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      this.logger.warn(`create expense failed — userId=${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user,
    });

    let saved;
    try {
      saved = await this.expenseRepository.save(expense);
      this.logger.log(`expense created — userId=${user.id}`);
    } catch (error) {
      this.logger.error(
        `error creating expense — userId=${user.id}, dto=${JSON.stringify(createExpenseDto)}`,
        (error as Error).stack,
      );
      throw error;
    }

    return plainToInstance(ResponseExpenseDto, {
      ...saved,
      user_id: user.id,
    });
  }

  async findAll(params: {
    userId: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }) {
    const { userId, startDate, endDate, page = 1, size = 10 } = params;

    this.logger.debug(
      `findAll called — userId=${userId}, filters=${JSON.stringify({
        startDate,
        endDate,
      })}, page=${page}, size=${size}`,
    );

    const where: FindOptionsWhere<Expense> = {
      user: { id: userId },
    };

    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    } else if (startDate) {
      where.date = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.date = LessThanOrEqual(endDate);
    }

    const [rows, total] = await this.expenseRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      take: size,
      skip: (page - 1) * size,
    });

    const totalPages = Math.ceil(total / size);

    this.logger.log(
      `findAll success — userId=${userId}, total=${total}, page=${page}/${totalPages}`,
    );

    return {
      data: rows,
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

  async findOne(id: number, userId: number) {
    this.logger.debug(`findOne called — id=${id}, userId=${userId}`);
    const expense = await this.validateOwnership(id, userId);
    this.logger.log(`expense found — id=${id}, userId=${userId}`);
    return expense;
  }

  async findLatestByUser(userId: number, limit = 10) {
    this.logger.debug(
      `findLatestByUser called — userId=${userId}, limit=${limit}`,
    );
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
      take: limit,
    });
  }

  async update(params: {
    id: number;
    updateExpenseDto: UpdateExpenseDto;
    userId: number;
  }) {
    const { id, updateExpenseDto, userId } = params;
    this.logger.debug(`update called — id=${id}, userId=${userId}`);
    const expense = await this.validateOwnership(id, userId);

    Object.assign(expense, updateExpenseDto);
    const updated = await this.expenseRepository.save(expense);

    this.logger.log(`expense updated — id=${id}, userId=${userId}`);

    return updated;
  }

  async remove(id: number, userId: number) {
    this.logger.debug(`remove called — id=${id}, userId=${userId}`);
    await this.validateOwnership(id, userId);
    this.logger.log(`expense deleted — id=${id}, userId=${userId}`);
    return this.expenseRepository.delete({ id });
  }

  private async validateOwnership(
    id: number,
    userId: number,
  ): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!expense) throw new NotFoundException('Expense not found');
    if (expense.user.id !== userId)
      throw new ForbiddenException('You do not have access to this expense');
    return expense;
  }
}
