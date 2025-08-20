import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class FilterExpenseDto {
  @ApiProperty({
    example: '2023-01-01',
    description: 'Start date for filtering expenses',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2023-12-31',
    description: 'End date for filtering expenses',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
