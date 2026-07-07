import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { type UUID } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
import { AppResponse } from 'src/utils/types';
import { Coupon } from 'generated/prisma/client';
@Injectable()
export class CouponService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(
    createCouponDto: CreateCouponDto,
  ): Promise<AppResponse<Coupon>> {
    const exCoupon = await this.databaseService.coupon.findFirst({
      where: {
        name: createCouponDto.name,
      },
    });

    if (exCoupon) {
      throw new ConflictException('Coupon already exist');
    }

    const coupon = await this.databaseService.coupon.create({
      data: {
        ...createCouponDto,
      },
    });
    return {
      status: 201,
      message: 'Coupon created successfully',
      data: coupon,
    };
  }

  async findAll(): Promise<AppResponse<Coupon[]>> {
    const coupons = await this.databaseService.coupon.findMany();

    return {
      status: 200,
      message: 'Coupons found',
      isEmpty: coupons.length === 0,
      length: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: UUID): Promise<AppResponse<Coupon>> {
    const coupon = await this.databaseService.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return {
      status: 200,
      message: 'Coupon Found',
      data: coupon,
    };
  }

  async update(
    id: UUID,
    updateCouponDto: UpdateCouponDto,
  ): Promise<AppResponse<Coupon>> {
    if (!updateCouponDto || Object.keys(updateCouponDto).length === 0) {
      throw new BadRequestException(
        'You must pass at least one field to update',
      );
    }

    const { data: exCoupon } = await this.findOne(id);
    const updatedCoupon = await this.databaseService.coupon.update({
      where: { id },
      data: {
        ...exCoupon,
        ...updateCouponDto,
      },
    });
    return {
      status: 200,
      message: 'coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: UUID) {
    await this.findOne(id);
    await this.databaseService.coupon.delete({
      where: {
        id,
      },
    });
  }
}
