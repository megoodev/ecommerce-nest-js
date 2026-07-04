import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserRole } from 'src/utils/enum';
import { AppResponse, UserData } from 'src/utils/types';
import { PagenationQueryDto } from './dto/pagenationQueryDto';
import { UpdateUserDto } from './dto/update.user.dto';
import { CryptographyService } from 'src/common-module/cryptography/Cryptography.service';
import { type UUID } from 'crypto';
@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: CryptographyService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<AppResponse<UserData>> {
    const existingUser = await this.databaseService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPass = this.hashingService.hash(createUserDto.password);
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

  async findAll(query: PagenationQueryDto): Promise<AppResponse<UserData[]>> {
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
      isEmpty: formattedUsers.length === 0,
      length: formattedUsers.length,
      message: 'Users found',
      data: formattedUsers,
    };
  }

  async findOne(id: UUID) {
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

  async update(
    id: UUID,
    updateUserDto: UpdateUserDto,
  ): Promise<AppResponse<UserData>> {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException(
        'You must pass at least one field to update',
      );
    }

    const { data: existingUser } = await this.findOne(id);

    const password = updateUserDto.password
      ? this.hashingService.hash(updateUserDto.password)
      : existingUser.password;
    const exisitingEmail = await this.databaseService.user.findUnique({
      where: {
        email: updateUserDto.email,
      },
    });
    if (exisitingEmail && exisitingEmail.id != id) {
      throw new ForbiddenException('This email take it!');
    }
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

  async remove(id: UUID) {
    const { data: existingUser } = await this.findOne(id);

    await this.databaseService.user.delete({
      where: {
        id: existingUser.id,
      },
    });
  }
}
