import { IsString, IsUrl, Length } from 'class-validator';

export class categoryDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsString()
  @IsUrl()
  image: string;
}
