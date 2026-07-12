import { IsIn, IsInt, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @ValidateIf((o) => o.adjustment === undefined)
  @IsInt()
  quantity?: number;

  @IsOptional()
  @ValidateIf((o) => o.quantity === undefined) // تصحيح الخطأ الإملائي هنا
  @IsInt()
  @IsIn([1, -1])
  adjustment?: number;
}
