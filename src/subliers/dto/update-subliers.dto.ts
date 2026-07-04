import { PartialType } from '@nestjs/mapped-types';
import { CreateSubliersDto } from './create-subliers.dto';

export class UpdateSubliersDto extends PartialType(CreateSubliersDto) {}
