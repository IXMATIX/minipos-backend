import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/pagination/dto/pagination-response.dto';
import { ResponseExpenseDto } from './response-expense.dto';

export class ExpensePaginationResponseDto {
  @ApiProperty({
    isArray: true,
    type: () => ResponseExpenseDto,
  })
  data: ResponseExpenseDto[];

  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;
}
