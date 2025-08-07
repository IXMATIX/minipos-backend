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

@Auth()
@Controller('expenses')
export class ExpensesController {
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
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  @ApiResponse({
    status: 201,
    description: 'List of expenses',
    type: [ResponseExpenseDto],
  })
  @Get()
  async findAll(@Req() req: RequestWithUser, @Query() query: FilterExpenseDto) {
    const { startDate, endDate } = query;
    return this.expensesService.findAll({
      userId: req.user.id,
      startDate,
      endDate,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Expense found',
    type: ResponseExpenseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
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
    await this.expensesService.remove(+id, req.user.id);
    return { message: 'Expense deleted successfully' };
  }
}
