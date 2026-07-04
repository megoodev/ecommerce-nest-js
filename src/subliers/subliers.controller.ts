import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubliersService } from './subliers.service';
import { CreateSubliersDto } from './dto/create-subliers.dto';
import { UpdateSubliersDto } from './dto/update-subliers.dto';
import { type UUID } from 'crypto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';

@Controller('api/subliers')
export class SubliersController {
  constructor(private readonly subliersService: SubliersService) {}

  @Post()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  create(@Body() CreateSubliersDto: CreateSubliersDto) {
    return this.subliersService.create(CreateSubliersDto);
  }

  @Get()
  findAll() {
    return this.subliersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.subliersService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  update(@Param('id') id: UUID, @Body() UpdateSubliersDto: UpdateSubliersDto) {
    return this.subliersService.update(id, UpdateSubliersDto);
  }

  @Delete(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID) {
    return this.subliersService.remove(id);
  }
}
