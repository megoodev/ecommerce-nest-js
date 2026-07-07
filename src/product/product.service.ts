import {
  ConflictException,
  Injectable,
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
      data: {
        title: createProductDto.title,
        description: createProductDto.description,
        quantity: createProductDto.quantity,
        imageCover: createProductDto.imageCover,
        images: createProductDto.images,
        price: createProductDto.price,
        priceAfterDiscount: createProductDto.priceAfterDiscount,
        color: createProductDto.color,
        categoryId: createProductDto.categoryId,
        subCategoryId: createProductDto.subCategoryId,
        brandId: createProductDto.brandId,
      },
    });
    return {
      status: 201,

      message: 'Product creaSted successfully',
      data: product,
    };
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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
