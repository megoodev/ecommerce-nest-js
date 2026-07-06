import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequastProductController } from './request-product.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [RequastProductController],
  providers: [RequestProductService],
  imports: [DatabaseModule],
})
export class RequestProductModule {}
