import { ApiProperty } from '@nestjs/swagger';
import { SaleResponseDto } from './sale-response.dto';
import { PaginationResponseDto } from 'src/pagination/dto/pagination-response.dto';

export class SalePaginationResponseDto {
  @ApiProperty({
    isArray: true,
    type: () => SaleResponseDto,
  })
  data: SaleResponseDto[];

  @ApiProperty({ type: () => PaginationResponseDto })
  pagination: PaginationResponseDto;
}
