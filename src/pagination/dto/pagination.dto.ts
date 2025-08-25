import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Number of items to return',
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    description: 'Number of items to skip',
    default: 0,
  })
  @IsOptional()
  @Min(0)
  offset?: number;
}
