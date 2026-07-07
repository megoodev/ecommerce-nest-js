import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryDto } from './dto/category.dto';
import { updateCategoryDto } from './dto/update.category.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { AppResponse, CategoryData } from 'src/utils/types';
import { Category } from 'generated/prisma/client';

@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  /**
   * @body categoryDto name & image url
   * @returns  return category data
   * @access admin => just admin can access
   */

  @Post()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  create(@Body() category: categoryDto): Promise<AppResponse<Category>> {
    return this.categoryService.create(category);
  }
  /**
   * @returns  all  category data
   * @access all user can access
   */
  @Get()
  findAll(): Promise<AppResponse<Category[]>> {
    return this.categoryService.findAll();
  }
  /**
   * @param id category id
   * @returns  find a single category
   * @access all user can access
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AppResponse<Category>> {
    return this.categoryService.findOne(id);
  }
  /**
   * @param id category id
   * @body updateCategoryDto name & image url
   * @returns updated single category
   * @access just admin can access
   */

  @Patch(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategory: updateCategoryDto,
  ): Promise<AppResponse<Category>> {
    return this.categoryService.update(id, updateCategory);
  }
  /**
   * @param id category id
   * @returns delete a category
   * @access just admin can access
   */

  @Delete(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
