import { ApiProperty } from '@nestjs/swagger';

export class DeleteSaleResponseDto {
  @ApiProperty({ example: 'Sale deleted successfully' })
  message: string;
}
