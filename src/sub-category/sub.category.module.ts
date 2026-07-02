import { Module } from '@nestjs/common';
import { subCategoryService } from './sub-category.service';
import { subCategoryController } from './sub-category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [subCategoryController],
  providers: [subCategoryService],
  imports: [DatabaseModule, CategoryModule],
})
export class subCategoryModule {}
