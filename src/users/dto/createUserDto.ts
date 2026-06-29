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
  //   name
  name: string;
  @IsString()
  @IsEmail()
  //   email
  email: string;
  @IsString()
  @Length(6, 20)
  //   password
  password: string;
  @IsOptional()
  @IsUrl()
  //   avatar
  avatar?: string;
  @IsInt()
  @IsOptional()
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

  @IsBoolean()
  //   active
  active: boolean;
  @IsString()
  @IsEnum(Gender)
  gender: Gender;
  @IsEnum(UserRole)
  @IsOptional()
  @IsString()
  role: UserRole;
}
