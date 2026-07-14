import { IsIn, IsInt, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @ValidateIf((o) => !o.adjustment)
  @IsNumber()
  quantity: number;

  @ValidateIf((o) => !o.quantity) 
  @IsNumber()
  @IsIn([1, -1])
  adjustment: number;
}
