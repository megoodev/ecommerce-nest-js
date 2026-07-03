import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { categoryDto } from './dto/category.dto';
import { DatabaseService } from 'src/database/database.service';
import { updateCategoryDto } from './dto/update.category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create({ name, image }: categoryDto) {
    const existingCategory = await this.databaseService.category.findUnique({
      where: {
        name,
      },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    const category = await this.databaseService.category.create({
      data: {
        name,
        image,
      },
    });
    return {
      status: 201,
      message: 'Category created successfully',
      data: category,
    };
  }
  async findAll() {
    const categories = await this.databaseService.category.findMany();
    return {
      status: 200,
      message: 'Find all category',
      isEmpty: categories.length == 0,
      data: categories,
    };
  }
  async findOne(id: string) {
    const category = await this.databaseService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      status: 200,
      message: 'Found category successfully',
      data: category,
    };
  }
  async update(id: string, { name, image }: updateCategoryDto) {
    if (!name && !image) {
      throw new BadRequestException(
        'You must pass at least one field to update',
      );
    }

    const category = await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (name === category.name) {
      throw new BadRequestException('This category already uses that name');
    }
    const existingName = await this.databaseService.category.findUnique({
      where: {
        name: name ?? category.name,
      },
    });
    if (existingName && existingName.name === name && id !== existingName.id) {
      throw new ConflictException('Category name is already in use');
    }
    const updatedCategory = await this.databaseService.category.update({
      where: { id },
      data: {
        name: name ?? category.name,
        image: image ?? category.image,
      },
    });
    return {
      status: 203,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async delete(id: string) {
    const category = await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Category not found',
      });
    }
    await this.databaseService.category.delete({
      where: { id },
    });
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}
