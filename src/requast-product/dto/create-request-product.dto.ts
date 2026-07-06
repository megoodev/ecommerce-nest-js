import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestProductDto {
  @IsString()
  titleNeed: string;

  @IsString()
  @MinLength(5)
  detailes: string;

  @IsNumber()
  @Min(1)
  qauntity: number;

  @IsOptional()
  category?: string;
}
