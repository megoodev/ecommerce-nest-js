import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { subCategoryDto } from './dto/sub-category.dto';
import { type UUID } from 'crypto';
import { CategoryService } from 'src/category/category.service';
import { AppResponse } from 'src/utils/types';
import { subCategory } from 'generated/prisma/client';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly category: CategoryService,
  ) {}
  async create(subCategory: subCategoryDto): Promise<AppResponse<subCategory>> {
    await this.category.findOne(subCategory.categoryId);

    const exSubCategory = await this.databaseService.subCategory.findUnique({
      where: {
        name: subCategory.name,
        AND: {
          categoryId: subCategory.categoryId,
        },
      },
    });

    if (exSubCategory) {
      throw new ForbiddenException('The category name already existing');
    }

    const subCate = await this.databaseService.subCategory.create({
      data: {
        ...subCategory,
      },
    });
    return {
      status: 201,
      message: 'Sub category created successully',
      data: subCate,
    };
  }
  async findAll(id: UUID): Promise<AppResponse<subCategory[]>> {
    const { data: category } = await this.category.findOne(id);

    const subCategories = await this.databaseService.subCategory.findMany({
      where: {
        categoryId: category.id,
      },
    });
    return {
      status: 200,
      message: 'Find all sub categoreis',
      isEmpty: subCategories.length === 0,
      data: subCategories,
    };
  }

  async update(id: UUID, name: string): Promise<AppResponse<subCategory>> {
    if (!name || name.trim() === '') {
      throw new BadRequestException(
        'You must pass at least one field to update',
      );
    }

    await this.findOne(id);
    const sub = await this.databaseService.subCategory.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });
    return {
      status: 201,
      message: 'update sub category succussfully',
      data: sub,
    };
  }

  async delete(id: UUID) {
    await this.findOne(id);
    await this.databaseService.subCategory.delete({
      where: { id },
    });
  }

  async findOne(id: UUID): Promise<any> {
    const subCate = await this.databaseService.subCategory.findUnique({
      where: { id },
    });
    if (!subCate) {
      throw new NotFoundException('Sub category not found!');
    }
    return subCate;
  }
}
