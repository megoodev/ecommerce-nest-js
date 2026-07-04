import { Module } from '@nestjs/common';
import { SubliersService } from './subliers.service';
import { SubliersController } from './subliers.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SubliersController],
  providers: [SubliersService, JwtService],
  imports: [DatabaseModule],
})
export class BrandModule {}
