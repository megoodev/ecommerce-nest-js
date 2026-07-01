import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { SignupUserDto } from './dto/signup.auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from 'src/utils/types';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/utils/enum';
import { SigninAuthDto } from './dto/signin.auth.dto';
import { HashingService } from 'src/commen/auth/hashing.service';
import { tokenService } from 'src/commen/auth/token.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly hashingService: HashingService,
    private readonly tokenService: tokenService,
  ) {}

  async create(createAuthDto: SignupUserDto) {
    const exitingUser = await this.databaseService.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (exitingUser) {
      throw new HttpException('user already exisit', 403);
    }
    const { password } = createAuthDto;
    const hashedPassword = this.hashingService.hash(password);

    const user = await this.databaseService.user.create({
      data: {
        ...createAuthDto,
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

    const accessToken = await this.tokenService.getAccessToken(
      user as JwtPayloadType,
    );
    return {
      status: 201,
      message: 'User signup successfully',
      data: user,
      accessToken: accessToken,
    };
  }

  // ==============================================================================

  async findOne(signinAuthDto: SigninAuthDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: signinAuthDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('Wrong email or password');
    }
    this.hashingService.compere(signinAuthDto.password, user.password);
    const accessToken = await this.tokenService.getAccessToken(
      user as JwtPayloadType,
    );

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
