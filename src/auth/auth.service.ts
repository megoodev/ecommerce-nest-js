import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/utils/types';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/utils/enum';
import {
  resetPasswordDto,
  SigninDto,
  SignupDto,
  virfyCode,
} from './dto/auth.dto';
import { CryptographyService } from 'src/common-module/cryptography/Cryptography.service';
import { ResendService } from 'nestjs-resend';
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly CryptographyService: CryptographyService,
    private readonly resendService: ResendService,
  ) {}

  /**
   *
   * @param SignupUserDto name & email & password
   * @returns user data and access token
   */
  async SignUp(SignupUserDto: SignupDto) {
    const exitingUser = await this.databaseService.user.findUnique({
      where: {
        email: SignupUserDto.email,
      },
    });
    if (exitingUser) {
      throw new HttpException('user already exisit', 403);
    }
    const { password } = SignupUserDto;
    const hashedPassword = this.CryptographyService.hash(password);

    const user = await this.databaseService.user.create({
      data: {
        ...SignupUserDto,
        password: hashedPassword,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    const accessToken = await this.getAccessToken(user as JwtPayloadType);
    return {
      status: 201,
      message: 'User signup successfully',
      data: user,
      accessToken: accessToken,
    };
  }

  /**
   *
   * @param signinAuthDto email and password
   * @returns user data and access token
   */

  async SignIn(signinAuthDto: SigninDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: signinAuthDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('Wrong email or password');
    }
    this.CryptographyService.compere(signinAuthDto.password, user.password);
    const accessToken = await this.getAccessToken(user as JwtPayloadType);

    return {
      status: 200,
      message: 'user signin successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
      accessToken,
    };
  }
  async resetPassword({ email }: resetPasswordDto) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const u = await this.databaseService.user.update({
      where: {
        email,
      },
      data: {
        VerificationCode: code,
      },
    });
    const htmlTemplete = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <tr>
      <td align="center">
        
        <!-- Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header/Logo Area -->
          <tr>
            <td align="center" style="padding: 30px 40px 10px 40px;">
              <h2 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Your Brand</h2>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding: 20px 40px 30px 40px; text-align: center;">
              <h1 style="margin: 0 0 16px 0; color: #111111; font-size: 22px; font-weight: 600;">Verify your identity</h1>
              <p style="margin: 0 0 24px 0; color: #555555; font-size: 15px; line-height: 24px;">
                Please use the following verification code to complete your request. This code is valid for 5 minutes.
              </p>
              
              <!-- Code Display Box -->
              <div style="background-color: #f0f4f8; border-radius: 6px; padding: 16px 24px; display: inline-block; margin-bottom: 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0066cc;">
                  ${code}
                </span>
              </div>

              <p style="margin: 0; color: #888888; font-size: 13px; line-height: 20px;">
                If you did not request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
              </p>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 18px;">
                © 2026 Your Company. All rights reserved.<br>
                123 Innovation Way, Tech District.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>  
    `;
    await this.resendService.send({
      from: 'you@example.com',
      to: email,
      subject: 'reset password',
      html: htmlTemplete,
    });
    console.log(u);
    return {
      status: 200,
      message: `mesage send successfully`,
    };
  }
  async virfyCode({ email, code }: virfyCode) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.VerificationCode !== code) {
      throw new ForbiddenException('invalid code, try agin');
    }
    await this.databaseService.user.update({
      where: {
        email,
      },
      data: {
        VerificationCode: null,
      },
    });
    return {
      status: 204,
      message: 'correct code',
    };
  }

  async changePassword({ email, password }: SigninDto) {
    const hashedPass = this.CryptographyService.hash(password);
    const user = await this.databaseService.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPass,
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        role: true,
      },
    });
    const accessToken = this.getAccessToken(user as JwtPayloadType);
    return {
      status: 200,
      message: 'Passowrd reset successfully!',
      data: user,
      accessToken,
    };
  }
  async getAccessToken(user: JwtPayloadType) {
    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role as unknown as UserRole,
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30h',
      secret: this.config.get<string>('SECRET_KEY'),
    });
  }
}

/*
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <tr>
    <td align="center">
      
      <!-- Email Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
        
        <!-- Header/Logo Area -->
        <tr>
          <td align="center" style="padding: 30px 40px 10px 40px;">
            <h2 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Your Brand</h2>
          </td>
        </tr>

        <!-- Main Content Area -->
        <tr>
          <td style="padding: 20px 40px 30px 40px; text-align: center;">
            <h1 style="margin: 0 0 16px 0; color: #111111; font-size: 22px; font-weight: 600;">Verify your identity</h1>
            <p style="margin: 0 0 24px 0; color: #555555; font-size: 15px; line-height: 24px;">
              Please use the following verification code to complete your request. This code is valid for 5 minutes.
            </p>
            
            <!-- Code Display Box -->
            <div style="background-color: #f0f4f8; border-radius: 6px; padding: 16px 24px; display: inline-block; margin-bottom: 24px;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0066cc;">
                ${otpCode}
              </span>
            </div>

            <p style="margin: 0; color: #888888; font-size: 13px; line-height: 20px;">
              If you did not request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
            </p>
          </td>
        </tr>

        <!-- Footer Area -->
        <tr>
          <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; text-align: center;">
            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 18px;">
              © 2026 Your Company. All rights reserved.<br>
              123 Innovation Way, Tech District.
            </p>
          </td>
        </tr>

      </table>
      <!-- /Email Container -->

    </td>
  </tr>
</table> 
 */
