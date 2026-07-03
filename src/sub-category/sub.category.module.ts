import { Module } from '@nestjs/common';
import { subCategoryService } from './sub-category.service';
import { subCategoryController } from './sub-category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from 'src/category/category.module';
import { DatabaseService } from 'src/database/database.service';
import { CategoryService } from 'src/category/category.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [subCategoryController],
  providers: [subCategoryService, CategoryService,JwtService],
  imports: [DatabaseModule],
})
export class subCategoryModule {}
