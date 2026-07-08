import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { AppResponse } from 'src/utils/types';
import { Product } from 'generated/prisma/client';
import { type UUID } from 'node:crypto';
import { ProductQueryDto } from './dto/query-product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<AppResponse<Product>> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: ProductQueryDto): Promise<AppResponse<Product[]>> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: UUID): Promise<AppResponse<Product>> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: UUID,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<AppResponse<Product>> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID): Promise<void> {
    return this.productService.remove(id);
  }
}
