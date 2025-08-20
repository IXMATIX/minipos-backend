import {
  ForbiddenException,
  Injectable,
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
  constructor(
    @InjectRepository(Expense) private expenseRepository: Repository<Expense>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new NotFoundException('User not found');

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user,
    });

    const saved = await this.expenseRepository.save(expense);
    return plainToInstance(ResponseExpenseDto, {
      ...saved,
      user_id: user.id,
    });
  }

  async findAll(params: {
    userId: number;
    startDate?: string;
    endDate?: string;
  }) {
    const { userId, startDate, endDate } = params;

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

    return this.expenseRepository.find({ where });
  }

  async findOne(id: number, userId: number) {
    const expense = await this.validateOwnership(id, userId);
    return expense;
  }

  async findLatestByUser(userId: number, limit = 10) {
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
    const expense = await this.validateOwnership(id, userId);

    Object.assign(expense, updateExpenseDto);
    const updated = await this.expenseRepository.save(expense);

    return updated;
  }

  async remove(id: number, userId: number) {
    await this.validateOwnership(id, userId);
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
