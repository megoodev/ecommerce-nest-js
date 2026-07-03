import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
  MinDate,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), { message: 'You can only add a future date' })
  expireDate: Date;

  @IsNumber()
  @Min(1)
  @Max(100)
  discount: number;
}
