import { PartialType } from '@nestjs/mapped-types';
import { SignupUserDto } from './signup.auth.dto';

export class UpdateAuthDto extends PartialType(SignupUserDto) {}
