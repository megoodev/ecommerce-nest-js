import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from 'src/utils/enum';
import { JwtPayloadType } from 'src/utils/types';
import { Roles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private ConfigService: ConfigService,
    private JWTService: JwtService,
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
        const payload: JwtPayloadType = await this.JWTService.verifyAsync(
          token,
          {
            secret: this.ConfigService.get<string>('SECRET_KEY'),
          },
        );

        if (roles.includes(payload.role)) {
          req['user'] = payload;
        }
        else {
            return false
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


// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { UserRole } from 'src/utils/enum';
// import { JwtPayloadType } from 'src/utils/types';
// import { Roles } from '../decorator/roles.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private configService: ConfigService, // Fixed naming casing
//     private jwtService: JwtService,       // Fixed naming casing
//   ) {}

//   async canActivate(ctx: ExecutionContext): Promise<boolean> {
//     // 1. Get required roles from decorator
//     const roles: UserRole[] = this.reflector.getAllAndOverride(Roles, [
//       ctx.getHandler(),
//       ctx.getClass(),
//     ]);

//     // If no roles are defined on the route, allow access (or handle via JwtGuard)
//     if (!roles || roles.length === 0) {
//       return true; 
//     }

//     const req: Request = ctx.switchToHttp().getRequest();
//     const [type, token] = req.headers.authorization?.split(' ') ?? [];

//     if (type !== 'Bearer' || !token) {
//       throw new UnauthorizedException('Missing or invalid token format');
//     }

//     try {
//       // 2. Verify the token
//       const payload: JwtPayloadType = await this.jwtService.verifyAsync(
//         token,
//         {
//           secret: this.configService.get<string>('SECRET_KEY'),
//         },
//       );

//       // Attach user payload to request object for use in controllers
//       req['user'] = payload;

//       // 3. CRITICAL FIX: Check if the user's role matches the required roles
//       const hasRole = roles.includes(payload.role);
      
//       if (!hasRole) {
//         throw new ForbiddenException('You do not have permission to access this resource');
//       }

//       return true; // Only returns true if they actually have the role!

//     } catch (error) {
//       // If token verification fails or an explicit exception was thrown above
//       if (error instanceof ForbiddenException) throw error;
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }