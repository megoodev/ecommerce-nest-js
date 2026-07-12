import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UserRole } from 'src/utils/enum';

import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CURRUNT_USER_KEY } from 'src/utils/constants';
import { type UUID } from 'crypto';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  create(@Req() req: Request, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(req[CURRUNT_USER_KEY].id, createCartDto);
  }
  @Post('coupon/:couponName')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  applayCoupon(@Param('couponName') couponName: string, @Req() req: Request) {
    return this.cartService.apllayCoupon(couponName, req[CURRUNT_USER_KEY].id);
  }

  @Get()
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  find(@Req() req: Request) {
    return this.cartService.find(req[CURRUNT_USER_KEY].id);
  }

  @Patch(':id')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, req[CURRUNT_USER_KEY].id, updateCartDto);
  }
  // product id
  @Delete(':id')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID, @Req() req: Request) {
    return this.cartService.remove(id, req[CURRUNT_USER_KEY].id);
  }
}

// ========== admin controller ==========
@Controller('api/dashboard/cart')
export class DashboardCartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  findAll(@Query() searchQueryDto: SearchQueryDto) {
    return this.cartService.findAll(searchQueryDto.userId);
  }
  @Get(':userId')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  findone(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() searchQueryDto: SearchQueryDto,
  ) {
    return this.cartService.findAll(searchQueryDto.userId);
  }
}
