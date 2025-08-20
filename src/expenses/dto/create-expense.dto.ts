import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    example: 1,
    description: 'Total amount of the expense',
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    example: 'Office supplies',
    description: 'Category of the expense',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Date of the expense',
  })
  @IsDateString()
  date: string;
}
