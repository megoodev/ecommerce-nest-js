import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'src/utils/enum';
import { JwtPayloadType } from 'src/utils/types';
import { Roles } from '../decorator/roles.decorator';
import { CURRUNR_USER_KEY } from 'src/utils/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] = this.reflector.getAllAndOverride(Roles, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles || roles.length == 0) {
      return false;
    }
    const req: Request = ctx.switchToHttp().getRequest();
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (token && type == 'Bearer') {
      try {
        const payload: JwtPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.config.get<string>('SECRET_KEY'),
          },
        );

        if (roles.includes(payload.role)) {
          req[CURRUNR_USER_KEY] = payload;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
}
