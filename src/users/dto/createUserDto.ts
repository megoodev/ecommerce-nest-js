import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Gender, UserRole } from 'src/utils/enum';

export class CreateUserDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)s
  password: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsOptional()
  @IsString()
  PhoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(UserRole)
  @IsOptional()
  @IsString()
  role: UserRole;
}
