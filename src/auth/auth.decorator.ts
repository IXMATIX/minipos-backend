import { applyDecorators } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth('jwt-auth'));
}
