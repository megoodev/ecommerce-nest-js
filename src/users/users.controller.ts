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
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { UserRole } from 'src/utils/enum';
import { PagenationQueryDto } from './dto/pagenationQueryDto';
import { UpdateUserDto } from './dto/update.user.dto';

/**
 * @access just admin can access users
 
 *  */
@Roles([UserRole.admin])
@UseGuards(RolesGuard)
@Controller('/api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /**
   * @body CreateUserDto
   * @returns  user data
   */
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  /**
   * @returns find all users data
   */
  @Get()
  async findAll(
    @Query()
    query: PagenationQueryDto,
  ) {
    return await this.usersService.findAll(query);
  }
  /**
   * @param id user id
   * @returns  single a user data
   */

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  /**
   * @param id user id
   * @body UpdateUserDto
   * @returns  return user data after updated
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  /**
   * @param id user id
   * @returns  delete a user & return void status 204
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
