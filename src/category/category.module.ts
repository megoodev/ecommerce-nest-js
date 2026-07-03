import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
  imports: [DatabaseModule]
})
export class CategoryModule {}
