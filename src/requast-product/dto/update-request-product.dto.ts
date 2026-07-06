import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestProductDto } from './create-request-product.dto';

export class UpdateRequastProductDto extends PartialType(
  CreateRequestProductDto,
) {}
