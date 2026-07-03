import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResendModule } from 'nestjs-resend';
import { CategoryModule } from './category/category.module';
import { subCategoryModule } from './sub-category/sub.category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoryModule,
    subCategoryModule,
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BrandModule,
    CouponModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
