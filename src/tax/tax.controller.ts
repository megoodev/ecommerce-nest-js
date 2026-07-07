import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { AppResponse } from 'src/utils/types';
import { Tax } from 'generated/prisma/client';

@Controller('api/tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  createOrUpdate(
    @Body() createTaxDto: CreateTaxDto,
  ): Promise<AppResponse<Tax>> {
    return this.taxService.createOrUpdate(createTaxDto);
  }

  @Get()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  find(): Promise<AppResponse<Tax>> {
    return this.taxService.find();
  }

  @Delete()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  reSet(): Promise<AppResponse<Tax>> {
    return this.taxService.reSet();
  }
}
