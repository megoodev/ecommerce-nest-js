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
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { type UUID } from 'crypto';
import { AppResponse, CouponData } from 'src/utils/types';
@Controller('api/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  create(
    @Body() createCouponDto: CreateCouponDto,
  ): Promise<AppResponse<CouponData>> {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  findAll(): Promise<AppResponse<CouponData[]>> {
    return this.couponService.findAll();
  }

  @Get(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: UUID): Promise<AppResponse<CouponData>> {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: UUID,
    @Body() updateCouponDto: UpdateCouponDto,
  ): Promise<AppResponse<CouponData>> {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID) {
    return this.couponService.remove(id);
  }
}
