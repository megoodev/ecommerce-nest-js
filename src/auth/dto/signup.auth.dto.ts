import { IsEmail, IsString, Length } from "class-validator";

export class SignupUserDto {
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
