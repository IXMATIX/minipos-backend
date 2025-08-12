import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class ResponseExpenseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  @Transform(({ value }) => Number(value))
  total: number;

  @ApiProperty({ example: 'Office supplies' })
  @Expose()
  description?: string;

  @ApiProperty({ example: '2023-01-01' })
  @Expose()
  date: string;

  @ApiProperty({ example: 1 })
  @Expose()
  user_id: number;

  @ApiProperty({ example: '2025-08-04T18:30:45.122Z' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2025-08-04T18:30:45.122Z' })
  @Expose()
  updatedAt: string;

  @Exclude()
  user?: User;
}
