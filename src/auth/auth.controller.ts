import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignupUserDto } from './dto/signup.auth.dto';
import { SigninAuthDto } from './dto/signin.auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    createAuthDto: SignupUserDto,
  ) {
    return this.authService.create(createAuthDto);
  }

  @Get('sign-in')
  findOne(@Body() signinAuthDto: SigninAuthDto) {
    return this.authService.findOne(signinAuthDto);
  }
}
