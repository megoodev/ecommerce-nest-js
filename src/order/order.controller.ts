import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  type RawBodyRequest,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CURRUNT_USER_KEY } from 'src/utils/constants';
import { type Request } from 'express';

@Controller('api/order/checkout')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req[CURRUNT_USER_KEY].id, createOrderDto);
  }

  @Post('webhook')
  async webHook(@Req() request: RawBodyRequest<Request>) {
    const signature = request.headers['stripe-signature'] as string;
    return await this.orderService.webHook(request, signature);
  }
}
