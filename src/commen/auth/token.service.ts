import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/utils/enum';
import { JwtPayloadType } from 'src/utils/types';
@Injectable()
export class tokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
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
  async verifyToken(token: string): Promise<JwtPayloadType> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.config.get<string>('SECRET_KEY'),
    });
  }
}
