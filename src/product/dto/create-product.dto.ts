import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { type UUID } from 'node:crypto';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;
  @IsString()
  @MinLength(20)
  description: string;
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsString()
  @IsUrl()
  imageCover: string;
  @IsArray()
  images?: string[];
  @IsNumber()
  @Min(1)
  price: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  priceAfterDiscount?: number;
  @IsArray()
  color?: string[];
  @IsString()
  @IsUUID()
  categoryId: string;
  @IsOptional()
  @IsString()
  @IsUUID()
  subCategoryId?: string;
  @IsOptional()
  @IsString()
  @IsUUID()
  brandId?: string;
}
