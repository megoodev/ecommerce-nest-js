import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  imports: [DatabaseModule]
})
export class CouponModule {}
