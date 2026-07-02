import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';
import { updateCategoryDto } from './dto/update.category.dto';

@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  create(@Body() category: categoryDto) {
    return this.categoryService.create(category);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategory: updateCategoryDto) {
    return this.categoryService.update(id, updateCategory);
  }
  
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.categoryService.delete(id);
  }
}
