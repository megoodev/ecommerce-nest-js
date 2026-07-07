import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from 'src/category/category.module';
import { subCategoryModule } from 'src/sub-category/sub.category.module';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [DatabaseModule, CategoryModule, subCategoryModule, BrandModule],
})
export class ProductModule {}
