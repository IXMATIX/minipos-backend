import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';
export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token',
  })
  token: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user data',
  })
  user: UserResponseDto;
}
