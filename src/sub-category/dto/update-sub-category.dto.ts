import { PartialType } from '@nestjs/mapped-types';
import { subCategoryDto } from './sub-category.dto';

export class updateSubCategoryDto extends PartialType(subCategoryDto) {}
