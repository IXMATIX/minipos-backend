import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDeleteExpenseDto {
  @ApiProperty({ example: 'Expense deleted successfully' })
  @Expose()
  message: string;
}
