import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/users/guard/roles.guard';
import { CURRUNT_USER_KEY } from 'src/utils/constants';
import { type UUID } from 'crypto';
import { ReviewQueryDto } from './dto/query-reviews.dto';

@Controller('api')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('review')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  create(@Req() req: Request, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req[CURRUNT_USER_KEY], createReviewDto);
  }

  @Get('review')
  @Roles([UserRole.admin])
  @UseGuards(RolesGuard)
  findAll(@Query() query: ReviewQueryDto) {
    return this.reviewService.findAll(query);
  }
  @Get('product/:productId/reviews')
  productReview(
    @Query() query: ReviewQueryDto,
    @Param('productId') productId: UUID,
  ) {
    return this.reviewService.findByProduct(productId, query);
  }

  @Get('review/user/:id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.reviewService.findByUser(id);
  }
  @Patch('review/:id')
  @Roles([UserRole.user])
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: UUID,
    @Req() req: Request,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(
      id,
      req[CURRUNT_USER_KEY],
      updateReviewDto,
    );
  }

  @Delete(':id')
  @Roles([UserRole.user, UserRole.admin])
  @UseGuards(RolesGuard)
  remove(@Param('id') id: UUID, @Req() req: Request) {
    return this.reviewService.remove(id, req[CURRUNT_USER_KEY]);
  }
}
