import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto {
  @ApiProperty({ example: 1, description: 'current page' })
  current_page: number;

  @ApiProperty({ example: 20, description: 'size page' })
  page_size: number;

  @ApiProperty({ example: 100, description: 'total registers' })
  total_records: number;

  @ApiProperty({ example: 5, description: 'total pages' })
  total_pages: number;

  @ApiProperty({
    example: 2,
    nullable: true,
    description: 'next page (or null)',
  })
  next_page: number | null;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'previous page (or null)',
  })
  prev_page: number | null;

  @ApiProperty({ example: true })
  has_next: boolean;

  @ApiProperty({ example: false })
  has_prev: boolean;
}
