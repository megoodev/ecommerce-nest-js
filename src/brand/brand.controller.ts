import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { type UUID } from 'crypto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { AppResponse, BrandData } from 'src/utils/types';
import { Brand } from 'generated/prisma/client';

@Controller('api/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  create(@Body() createBrandDto: CreateBrandDto): Promise<AppResponse<Brand>> {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll(): Promise<AppResponse<Brand[]>> {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UUID): Promise<AppResponse<Brand>> {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: UUID,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<AppResponse<Brand>> {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID) {
    return this.brandService.remove(id);
  }
}
