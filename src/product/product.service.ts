import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { CategoryService } from 'src/category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { BrandService } from 'src/brand/brand.service';
import { type UUID } from 'node:crypto';
import { AppResponse } from 'src/utils/types';
import { Product } from 'generated/prisma/client';
import { productSelectAll } from 'src/utils/constants';
import { ProductQueryDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly brandService: BrandService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
  ): Promise<AppResponse<Product>> {
    const exProduct = await this.databaseService.product.findFirst({
      where: {
        title: createProductDto.title,
      },
    });
    if (exProduct) {
      throw new ConflictException('Prodect already exist!');
    }

    await this.categoryService.findOne(createProductDto.categoryId);
    createProductDto.subCategoryId &&
      (await this.subCategoryService.findOne(
        createProductDto.subCategoryId as UUID,
      ));
    createProductDto.brandId &&
      (await this.brandService.findOne(createProductDto.brandId as UUID));

    const product = await this.databaseService.product.create({
      data: createProductDto,
      include: productSelectAll,
    });
    return {
      status: 201,
      message: 'Product creaSted successfully',
      data: product,
    };
  }

  async findAll(query: ProductQueryDto): Promise<AppResponse<Product[]>> {
    // 1. Pagination
    const { _limit, page } = query;
    const skip = (page - 1) * _limit || 0;

    // 2. Filtration
    const requestQuery = { ...query };
    const removeQuery = ['page', '_limit', 'sort', 'key', 'category'];
    removeQuery.forEach((val) => delete requestQuery[val]);

    const sort = query?.sort || 'asc';
    const key = query?.key || undefined;
    if (requestQuery.category) {
      await this.categoryService.findOne(requestQuery.category);
    }
    const whereConditions: any = {
      price: requestQuery.price || undefined,
      categoryId: requestQuery.category,
      ratingAverage: requestQuery.ratingAverage,
    };
    if (key) {
      whereConditions.OR = [
        {
          title: {
            contains: key,
            mode: 'insensitive',
          },
          description: {
            contains: key,
            mode: 'insensitive',
          },
        },
        {},
      ];
    }
    const products = await this.databaseService.product.findMany({
      where: whereConditions,
      orderBy: {
        price: sort,
      },
      skip,
      take: _limit ? Number(_limit) : undefined,
    });

    return {
      status: 200,
      message: 'Products found',
      isEmpty: products.length === 0,
      length: products.length,
      data: products,
    };
  }

  async findOne(id: UUID): Promise<AppResponse<Product>> {
    const product = await this.databaseService.product.findUnique({
      where: {
        id,
      },
      include: productSelectAll,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      status: 200,
      message: 'Product found',
      data: product,
    };
  }

  async update(
    id: UUID,
    updateProductDto: UpdateProductDto,
  ): Promise<AppResponse<Product>> {
    await this.findOne(id);
    const product = await this.databaseService.product.update({
      where: { id },
      data: updateProductDto,
      include: productSelectAll,
    });

    return {
      status: 200,
      message: 'Product updated successfully',
      data: product,
    };
  }

  async remove(id: UUID) {
    await this.findOne(id);
    await this.databaseService.product.delete({
      where: { id },
    });
  }
}
// {
//   "title": "iPhone 15 Pro Max 256GB",
//   "descripion": "The ultimate iPhone featuring a strong and light titanium design with new contoured edges.",
//   "quantity": 45,
//   "imageCover": "https://example.com/images/iphone15-cover.jpg",
//   "images": [
//     "https://example.com/images/iphone15-side.jpg",
//     "https://example.com/images/iphone15-back.jpg"
//   ],
//   "price": 1200,
//   "priceAfterDiscount": 1100,
//   "color": ["Titanium Natural", "Titanium Blue"],
//   "categoryId": "3b2163b2-dc09-4ee4-9dfc-2794354226aa",
//   "subCategoryId": "8f6c3104-1b15-43bf-9f06-e7de1950cc88",
//   "brandId": "e3054f15-39be-4b0d-b4b6-45ef42ba9223"
// }
