import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ConfigService],
  imports: [DatabaseModule],
})
export class OrderModule {}
