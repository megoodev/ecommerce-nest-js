import { PartialType } from '@nestjs/mapped-types';
import { categoryDto } from './category.dto';
export class updateCategoryDto extends PartialType(categoryDto) {}
