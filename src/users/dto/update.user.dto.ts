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
import { UserRole } from 'src/utils/enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 30)
  //   name
  name: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  //   email
  email: string;
  @IsOptional()
  @IsString()
  @Length(6, 20)
  //   password
  password: string;
  @IsOptional()
  @IsOptional()
  @IsUrl()
  //   avatar
  avatar?: string;

  @IsOptional()
  @IsInt()
  //   age
  age?: number;

  @IsOptional()
  @IsString()
  //   phone number
  PhoneNumber?: string;
  @IsString()
  @IsOptional()
  //   address
  address?: string;

  @IsOptional()
  @IsBoolean()
  //   active
  active: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  @IsString()
  //   role
  role: UserRole;
}
