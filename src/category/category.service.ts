import {
  ForbiddenException,
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
      throw new ForbiddenException('Category already existing');
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
  async update(id: string, updateCategory: updateCategoryDto) {
    const category = await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    const existingName = await this.databaseService.category.findUnique({
      where: {
        name: updateCategory.name,
      },
    });
    if (existingName.name === updateCategory.name && id !== existingName.id) {
      throw new ForbiddenException('Name is existing!');
    }
    await this.databaseService.category.update({
      where: { id },
      data: {
        ...updateCategory,
      },
    });
  }

  async delete(id: string) {
    const category = await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    await this.databaseService.category.delete({
      where: { id },
    });
  }
}
