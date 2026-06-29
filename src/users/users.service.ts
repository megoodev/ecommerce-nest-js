import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/createUserDto';
import bcrypt from 'bcryptjs';
import { Gender, UserRole } from 'src/utils/enum';
import { UserRes } from 'src/utils/types';
import { PagenationQueryDto } from './dto/pagenationQueryDto';
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const existUser = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    if (!existUser) {
      throw new BadRequestException('this user is not defind,are you bot');
    }
    await this.databaseService.user.delete({
      where: {
        id: existUser.id,
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
