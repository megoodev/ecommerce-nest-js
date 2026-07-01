import { IsEmail, IsString, Length } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  @IsEmail()
  //   email
  email: string;
  @IsString()
  @Length(6, 20)
  //   password
  password: string;
}
