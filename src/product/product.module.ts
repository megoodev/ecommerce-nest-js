import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from 'src/category/category.module';
import { subCategoryModule } from 'src/sub-category/sub.category.module';
import { BrandModule } from 'src/brand/brand.module';
import { CategoryService } from 'src/category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { BrandService } from 'src/brand/brand.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService,CategoryService, SubCategoryService, BrandService],
  imports: [DatabaseModule],
})
export class ProductModule {}
