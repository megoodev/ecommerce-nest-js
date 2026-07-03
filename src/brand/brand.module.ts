import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService, JwtService],
  imports: [DatabaseModule],
})
export class BrandModule {}
