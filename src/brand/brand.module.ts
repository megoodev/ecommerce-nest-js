import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [DatabaseModule],
})
export class BrandModule {}
