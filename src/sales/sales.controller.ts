import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaleResponseDto } from './dto/sale-response.dto';
import { DeleteSaleResponseDto } from './dto/delete-sale-response.dto';
import { Auth } from 'src/auth/auth.decorator';
import { FilterSalesDto } from './dto/filter-sales.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';
@ApiTags('sales')
@Auth()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiResponse({
    status: 201,
    description: 'Sale created successfully',
    type: SaleResponseDto,
  })
  @Post()
  create(@Body() createSaleDto: CreateSaleDto, @Req() req: RequestWithUser) {
    return this.salesService.create(createSaleDto, req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'List of user sales',
    type: [SaleResponseDto],
  })
  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query() query: FilterSalesDto,
    @Query() pagination: PaginationDto,
  ) {
    const { startDate, endDate } = query;
    const { limit, offset } = pagination;

    return this.salesService.findAllByUser({
      userId: req.user.id,
      startDate,
      endDate,
      limit,
      offset,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Latest sales by user',
    type: [SaleResponseDto],
  })
  @Get('latest')
  getLatestSales(@Req() req: RequestWithUser, @Query('limit') limit?: number) {
    return this.salesService.findLatestByUser(req.user.id, limit);
  }

  @ApiResponse({
    status: 200,
    description: 'Sale retrieved successfully',
    type: SaleResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.salesService.findOne(id, req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Sale updated successfully',
    type: SaleResponseDto,
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleDto: UpdateSaleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.salesService.update(id, updateSaleDto, req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Sale deleted successfully',
    type: DeleteSaleResponseDto,
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    await this.salesService.remove(id, req.user.id);
    return { message: 'Sale deleted successfully' };
  }
}
