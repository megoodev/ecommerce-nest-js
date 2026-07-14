import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOrderDto {
  @IsUrl()
  success_url: string;
  @IsUrl()
  cancel_url: string;
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
