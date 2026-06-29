import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/createUserDto';
import bcrypt from 'bcryptjs';
import { UserRole } from 'src/utils/enum';
import { UserRes } from 'src/utils/types';
import { PagenationQueryDto } from './dto/pagenationQueryDto';
import { UpdateUserDto } from './dto/update.user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<UserRes> {
    const existingUser = await this.databaseService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPass = this.hashPassword(createUserDto.password);
    const user = await this.databaseService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPass,
        VerificationCode: 'vfsfSD',
        role: createUserDto.role,
        gender: createUserDto.gender,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });
    const formattedUsers = {
      ...user,
      role: user.role as unknown as UserRole,
    };
    return {
      status: 201,
      message: 'successfully',
      data: formattedUsers,
    };
  }

  async findAll(query: PagenationQueryDto): Promise<UserRes> {
    const { _limit, name, email, page, role, sort } = query;

    const users = await this.databaseService.user.findMany({
      take: _limit,
      skip: _limit && page ? _limit * (page - 1) : 0,
      orderBy: {
        name: sort ?? 'asc',
      },
      where: {
        email: {
          contains: email ?? '',
        },
        name: {
          contains: name ?? '',
        },
        role: role,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      role: user.role as unknown as UserRole,
    }));

    return {
      status: 200,
      message: 'successfully',
      data: formattedUsers,
    };
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        password: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return {
      status: 200,
      message: 'Get User Successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        role: user.role as unknown as UserRole,
        password: user.password,
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserRes> {
    const { data: existingUser } = await this.findOne(id);

    const password = updateUserDto.password
      ? this.hashPassword(updateUserDto.password)
      : existingUser.password;

    const updatedUser = await this.databaseService.user.update({
      where: {
        id,
      },
      data: { ...updateUserDto, password },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });
    const formattedUser = {
      ...updatedUser,
      role: updatedUser.role as unknown as UserRole,
    };
    return {
      status: 200,
      message: 'User Updated Successfully',
      data: formattedUser,
    };
  }

  async remove(id: string) {
    const { data: existingUser } = await this.findOne(id);

    await this.databaseService.user.delete({
      where: {
        id: existingUser.id,
      },
    });
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
