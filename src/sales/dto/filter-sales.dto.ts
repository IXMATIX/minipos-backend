import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class FilterSalesDto {
  @ApiProperty({
    example: '2023-01-01',
    description: 'Start date for filtering sales',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2023-12-31',
    description: 'End date for filtering sales',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
