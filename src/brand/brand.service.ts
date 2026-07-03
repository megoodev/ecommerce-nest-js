import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { type UUID } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class BrandService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBrandDto: CreateBrandDto) {
    const exbrand = await this.databaseService.brand.findFirst({
      where: { name: createBrandDto.name },
    });
    if (exbrand) {
      throw new ConflictException('Brand already exist');
    }
    const brand = await this.databaseService.brand.create({
      data: {
        ...createBrandDto,
      },
    });
    return {
      status: 201,
      message: 'Brand created succussfully',
      data: brand,
    };
  }

  async findAll() {
    const brands = await this.databaseService.brand.findMany();
    return {
      status: 200,
      message: 'Fond brands',
      isEmpty: brands.length === 0,
      length: brands.length,
      data: brands,
    };
  }

  async findOne(id: UUID) {
    const brand = await this.databaseService.brand.findUnique({
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return {
      status: 200,
      message: 'Fond brand',
      data: brand,
    };
  }

  async update(id: UUID, updateBrandDto: UpdateBrandDto) {
    if (!updateBrandDto || Object.keys(updateBrandDto).length === 0) {
      throw new BadRequestException(
        'You must pass at least one field to update',
      );
    }

    const { data: brand } = await this.findOne(id);
    if (
      updateBrandDto &&
      brand.name === updateBrandDto.name &&
      id !== brand.id
    ) {
      throw new ConflictException('Brand name already exists');
    }
    if (updateBrandDto && brand.name === updateBrandDto.name) {
      throw new ConflictException('Brand already uses that name');
    }
    const updatedBrand = await this.databaseService.brand.update({
      where: { id },
      data: {
        ...brand,
        ...updateBrandDto,
      },
    });
    return {
      status: 200,
      message: 'brand updated successfully',
      data: updatedBrand,
    };
  }

  async remove(id: UUID) {
    await this.findOne(id);
    await this.databaseService.brand.delete({
      where: { id },
    });
    return {
      status: 200,
      message: 'Brand deleted Successfully',
    };
  }
}
