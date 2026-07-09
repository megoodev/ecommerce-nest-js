import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AppResponse, JwtPayloadType } from 'src/utils/types';
import { DatabaseService } from 'src/database/database.service';
import { Review } from 'generated/prisma/client';
import { type UUID } from 'crypto';
import { UserRole } from 'src/utils/enum';
import { ReviewQueryDto } from './dto/query-reviews.dto';
import { Length } from 'class-validator';

@Injectable()
export class ReviewService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(
    user: JwtPayloadType,
    createReviewDto: CreateReviewDto,
  ): Promise<AppResponse<Review>> {
    const exReview = await this.databaseService.review.findUnique({
      where: {
        productId_userId: {
          productId: createReviewDto.productId,
          userId: user.id,
        },
      },
    });
    if (exReview) {
      throw new ConflictException(
        'already, You are maked a review on this product',
      );
    }
    const review = await this.databaseService.review.create({
      data: { ...createReviewDto, userId: user.id },
    });
    return {
      status: 201,
      message: 'Review created successfully',
      data: review,
    };
  }

  async findAll(query: ReviewQueryDto): Promise<AppResponse<Review[]>> {
    let { _limit, page, sort, userId, productId } = query;
    const skip = (page - 1) * _limit;
    sort = sort ?? 'asc';

    const whereCondation = {
      ...(userId && { userId }),
      ...(productId && { productId }),
    };

    const productReview = await this.databaseService.review.findMany({
      where: whereCondation,
      orderBy: {
        createdAt: sort,
      },
      include: {
        user: true,
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      skip,
      take: _limit ?? undefined,
    });

    return {
      status: 200,
      message: 'Reviews Found',
      isEmpty: productReview.length === 0,
      length: productReview.length,
      data: productReview,
    };
  }
  async findByUser(id: UUID) {
    const exUser = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!exUser) {
      throw new NotFoundException('User not found');
    }
    const userReviews = await this.databaseService.review.findMany({
      where: {
        userId: id,
      },
      include: {
        product: {
          select: {
            title: true,
            id: true,
            images: true,
          },
        },
        user: {
          select: {
            name: true,
            id: true,
            email: true,
          },
        },
      },
    });
    // user just can get reviews content to if want delete review has bad content
    const reviewsFilter = userReviews.filter((rev) => rev.content !== null);
    return {
      status: 200,
      message: 'Reviews found',
      isEmpty: reviewsFilter.length === 0,
      Length: reviewsFilter.length,
      data: reviewsFilter,
    };
  }
  async findByProduct(
    productId: UUID,
    query: ReviewQueryDto,
  ): Promise<AppResponse<Review[]>> {
    let { _limit, page, sort } = query;
    const skip = (page - 1) * _limit;
    sort = sort ?? 'asc';
    const productReview = await this.databaseService.review.findMany({
      where: { productId },
      orderBy: {
        createdAt: sort,
      },
      skip,
      take: _limit ?? 20,
    });
    return {
      status: 200,
      message: 'Reviews Found',
      isEmpty: productReview.length === 0,
      length: productReview.length,
      data: productReview,
    };
  }

  updatedAt: Date;
  async update(
    id: UUID,
    user: JwtPayloadType,
    updateReviewDto: UpdateReviewDto,
  ): Promise<AppResponse<Review>> {
    const exReview = await this.databaseService.review.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!exReview) {
      throw new NotFoundException('Review not found');
    }
    const updatedReview = await this.databaseService.review.update({
      where: {
        userId: user.id,
        id,
      },
      data: updateReviewDto,
    });
    return {
      status: 200,
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async remove(id: UUID, user: JwtPayloadType) {
    const exReview = await this.databaseService.review.findUnique({
      where: { id },
    });
    if (!exReview) {
      throw new NotFoundException('Review not found');
    }
    if (user.role === UserRole.admin) {
      await this.databaseService.review.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedBy: user.id,
          deletedAt: new Date(),
        },
      });
    }

    await this.databaseService.review.delete({
      where: { id, userId: user.id },
    });
  }
}
