import { IsNumber, Min } from 'class-validator';

export class CreateTaxDto {
  @IsNumber()
  @Min(0)
  taxPrice: number;
  @Min(0)
  @IsNumber()
  shipingTax: number;
}
