import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ReviewQueryDto {
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
  @IsString()
  sort?: 'asc' | 'desc';
  @IsString()
  @IsUUID()
  @IsOptional()
  userId?: string;
  @IsString()
  @IsUUID()
  @IsOptional()
  productId?: string;
}
