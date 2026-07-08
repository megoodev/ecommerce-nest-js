import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class FliterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gte?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lte?: number;
}

export class ProductQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  _limit?: number;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FliterDto)
  price?: FliterDto;
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FliterDto)
  ratingAverage?: FliterDto;
  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';
  @IsOptional()
  @IsString()
  key?: string;
  @IsOptional()
  @IsUUID()
  category?: string;
}
