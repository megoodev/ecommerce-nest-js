import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  VerifyCodeDto,
} from './dto/auth.dto';
import { AppResponse, UserData } from 'src/utils/types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  signUp(
    @Body() createAuthDto: SignupDto,
  ): Promise<AppResponse<Partial<UserData>>> {
    return this.authService.SignUp(createAuthDto);
  }

  @Post('sign-in')
  signIn(
    @Body() signinAuthDto: SigninDto,
  ): Promise<AppResponse<Partial<UserData>>> {
    return this.authService.SignIn(signinAuthDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetDto);
  }
  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }
  @Post('change-password')
  ChangePassword(@Body() change: SigninDto) {
    return this.authService.changePassword(change);
  }
}
