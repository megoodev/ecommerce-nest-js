import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { tokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [HashingService, tokenService, JwtService],
  exports: [HashingService, tokenService],

})
export class assitsModule {}
