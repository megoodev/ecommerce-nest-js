import { IsEmail, IsString, Length } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsEmail()
  //   email
  email: string;
  @IsString()
  @Length(6, 20)
  //   password
  password: string;
}
export class SignupDto {
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
}

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  //   email
  email: string;
}

export class VerifyCodeDto {
  @IsString()
  @IsEmail()
  //   email
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
