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
import { SubliersModule } from './subliers/subliers.module';
import { JwtModule } from '@nestjs/jwt';
import { RequestProductModule } from './requast-product/request-product.module';
import { TaxModule } from './tax/tax.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoryModule,
    subCategoryModule,
    SubliersModule,
    BrandModule,
    CouponModule,
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: `${10 * 24 * 60 * 60}s`,
      },
    }),
    RequestProductModule,
    TaxModule,
    ProductModule,
    ReviewModule,
    CartModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
