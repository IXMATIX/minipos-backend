import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Logger,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseExpenseDto } from './dto/response-expense.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Auth } from 'src/auth/auth.decorator';
import { ResponseDeleteExpenseDto } from './dto/response-delete-expense.dto';
import { FilterExpenseDto } from './dto/filter-expense.dto';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';
import { ExpensePaginationResponseDto } from './dto/response-expense-pagination.dto';

@Auth()
@Controller('expenses')
export class ExpensesController {
  private readonly logger = new Logger(ExpensesController.name);
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
    type: ResponseExpenseDto,
  })
  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Req() req: RequestWithUser,
  ) {
    this.logger.log(`Creating expense for user ID: ${req.user.id}`);
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'List of expenses',
    type: ExpensePaginationResponseDto,
  })
  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query() query: FilterExpenseDto,
    @Query() pagination: PaginationDto,
  ) {
    this.logger.log(`Fetching expenses for user ID: ${req.user.id}`);
    const { startDate, endDate } = query;
    return this.expensesService.findAll({
      userId: req.user.id,
      startDate,
      endDate,
      page: pagination.page,
      size: pagination.size,
    });
  }
  @Get('latest')
  findLatest(@Req() req: RequestWithUser, @Query('limit') limit?: number) {
    this.logger.log(
      `Fetching latest expenses for user ID: ${req.user.id} with limit: ${limit}`,
    );
    return this.expensesService.findLatestByUser(req.user.id, limit);
  }
  @ApiResponse({
    status: 200,
    description: 'Expense found',
    type: ResponseExpenseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    this.logger.log(`Fetching expense ID: ${id} for user ID: ${req.user.id}`);
    return this.expensesService.findOne(+id, req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ResponseExpenseDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: RequestWithUser,
  ) {
    this.logger.log(`Updating expense ID: ${id} for user ID: ${req.user.id} `);
    return this.expensesService.update({
      id: +id,
      updateExpenseDto,
      userId: req.user.id,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Expense deleted successfully',
    type: ResponseDeleteExpenseDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    this.logger.log(`Deleting expense ID: ${id} for user ID: ${req.user.id}`);
    await this.expensesService.remove(+id, req.user.id);
    return { message: 'Expense deleted successfully' };
  }
}
