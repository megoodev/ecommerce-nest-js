import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController, DashboardCartController } from './cart.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CartController, DashboardCartController],
  providers: [CartService],
  imports: [DatabaseModule],
})
export class CartModule {}
