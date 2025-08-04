import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '1',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2023-01-01T00:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @Expose()
  updatedAt: Date;
}
