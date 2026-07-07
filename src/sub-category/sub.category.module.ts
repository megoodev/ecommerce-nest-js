import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { subCategoryController } from './sub-category.controller';
import { DatabaseModule } from 'src/database/database.module';

import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [subCategoryController],
  providers: [SubCategoryService, CategoryService],
  imports: [DatabaseModule],
})
export class subCategoryModule {}
