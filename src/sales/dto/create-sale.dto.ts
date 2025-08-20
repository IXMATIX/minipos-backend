import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ example: 2, description: 'Amount of items sold' })
  @IsInt()
  amount: number;

  @ApiProperty({ example: 100, description: 'Price of the item' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    example: 'Description of the sale',
    description: 'Description of the sale',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2023-01-01', description: 'Date of the sale' })
  @IsDateString()
  date: string;
}
