import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { subCategoryService } from './sub-category.service';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { subCategoryDto } from './dto/sub-category.dto';
import { type UUID } from 'crypto';
import { updateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('api/sub-controller')
export class subCategoryController {
  constructor(private readonly subcategory: subCategoryService) {}
  /**
   *
   * @body subCategoryDto name & categoryID
   * @returns sub category data
   * @access just admin can access
   */
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() subCategory: subCategoryDto) {
    return this.subcategory.create(subCategory);
  }
  /**
   * @param id main category id
   * @returns find all category childern
   * @access public
   */
  @Get(':id')
  findAll(@Param('id') id: UUID) {
    return this.subcategory.findAll(id);
  }

  /**
   *
   * @body update sub category name
   * @param id sub category id
   * @returns sub category data after update
   * @access just admin can access
   */
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  @Patch()
  update(@Param('id') id: UUID, @Body('name') { name }: updateSubCategoryDto) {
    return this.subcategory.update(id, name);
  }
  /**
   *
   * @body delete sub category
   * @param id sub category id
   * @returns void
   * @access just admin can access
   */
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  @HttpCode(204)
  @Delete()
  delete(@Param('id') id: UUID) {
    return this.subcategory.delete(id);
  }
}
