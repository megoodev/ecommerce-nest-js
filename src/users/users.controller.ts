import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { UserRole } from 'src/utils/enum';
import { PagenationQueryDto } from './dto/pagenationQueryDto';

@Controller('/api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  async findAll(
    @Query(new ValidationPipe({ whitelist: true }))
    query: PagenationQueryDto,
  ) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
