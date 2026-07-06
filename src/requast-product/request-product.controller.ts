import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequastProductDto } from './dto/update-request-product.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { UserRole } from 'src/utils/enum';
import { AppResponse, RequestproductData } from 'src/utils/types';
import { CURRUNR_USER_KEY } from 'src/utils/constants';
import { type UUID } from 'crypto';

@Controller('api/request-product')
export class RequastProductController {
  constructor(private readonly requastProductService: RequestProductService) {}

  @Post()
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  create(
    @Body() createRequastProductDto: CreateRequestProductDto,
    @Req() req: Request,
  ): Promise<AppResponse<RequestproductData>> {
    return this.requastProductService.create(
      createRequastProductDto,
      req[CURRUNR_USER_KEY].id,
    );
  }

  @Get()
  @Roles([UserRole.admin, UserRole.user])
  @UseGuards(RolesGuard)
  findAll(@Req() req: Request): Promise<AppResponse<RequestproductData[]>> {
    return this.requastProductService.findAll(req[CURRUNR_USER_KEY]);
  }

  @Get(':id')
  @Roles([UserRole.admin, UserRole.user])
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: UUID, @Req() req: Request) {
    return this.requastProductService.findOne(id, req[CURRUNR_USER_KEY]);
  }

  @Patch(':id')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: UUID,
    @Req() req: Request,
    @Body() updateRequastProductDto: UpdateRequastProductDto,
  ) {
    return this.requastProductService.update(
      id,
      req[CURRUNR_USER_KEY],
      updateRequastProductDto,
    );
  }

  @Delete(':id')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID, @Req() req: Request) {
    return this.requastProductService.remove(id, req[CURRUNR_USER_KEY]);
  }
}
