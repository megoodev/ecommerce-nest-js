import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/utils/enum';

export class PagenationQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  _limit?: number;
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number;
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  email?: string;
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
