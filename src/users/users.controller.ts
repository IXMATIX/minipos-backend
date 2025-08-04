import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { LoginDto } from '../auth/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthResponseDto } from '../auth/dto/auth-response.dto';

import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Returns the currently authenticated user',
    type: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(
    @Req() req: { user: { id: string } },
  ): Promise<UserResponseDto> {
    const userId = Number(req.user.id);
    const user = await this.usersService.findById(userId);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthResponseDto,
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
