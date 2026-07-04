import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubliersDto } from './dto/create-subliers.dto';
import { UpdateSubliersDto } from './dto/update-subliers.dto';
import { type UUID } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class SubliersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSubliersDto: CreateSubliersDto) {
    const exsublier = await this.databaseService.sublier.findFirst({
      where: { name: createSubliersDto.name },
    });
    if (exsublier) {
      throw new ConflictException('sublier already exist');
    }
    const sublier = await this.databaseService.sublier.create({
      data: {
        ...createSubliersDto,
      },
    });
    return {
      status: 201,
      message: 'sublier created succussfully',
      data: sublier,
    };
  }

  async findAll() {
    const subliers = await this.databaseService.sublier.findMany();
    return {
      status: 200,
      message: 'Fond subliers',
      isEmpty: subliers.length === 0,
      length: subliers.length,
      data: subliers,
    };
  }

  async findOne(id: UUID) {
    const sublier = await this.databaseService.sublier.findUnique({
      where: { id },
    });
    if (!sublier) {
      throw new NotFoundException('sublier not found');
    }
    return {
      status: 200,
      message: 'Fond sublier',
      data: sublier,
    };
  }

  async update(id: UUID, updateSubliersDto: UpdateSubliersDto) {
    if (!UpdateSubliersDto || Object.keys(UpdateSubliersDto).length === 0) {
      throw new BadRequestException(
        'You must pass at least one field to update',
      );
    }

    const { data: sublier } = await this.findOne(id);
    if (
      updateSubliersDto &&
      sublier.name === updateSubliersDto.name &&
      id !== sublier.id
    ) {
      throw new ConflictException('Sublier name already exists');
    }
    if (updateSubliersDto && sublier.name === updateSubliersDto.name) {
      throw new ConflictException('Sublier already uses that name');
    }
    const updatedsublier = await this.databaseService.sublier.update({
      where: { id },
      data: {
        ...sublier,
        ...UpdateSubliersDto,
      },
    });
    return {
      status: 200,
      message: 'Sublier updated successfully',
      data: updatedsublier,
    };
  }

  async remove(id: UUID) {
    await this.findOne(id);
    await this.databaseService.sublier.delete({
      where: { id },
    });
    return {
      status: 200,
      message: 'Sublier deleted Successfully',
    };
  }
}
