// src/sales/dto/sale-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SaleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5 })
  amount: number;

  @ApiProperty({ example: 200 })
  price: number;

  @ApiProperty({ example: 'Updated sale description', nullable: true })
  description?: string;

  @ApiProperty({ example: '2025-08-01' })
  date: string;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: '2025-08-04T18:30:45.122Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-08-04T18:30:45.122Z' })
  updatedAt: string;
}
