import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [DatabaseModule]
})
export class ReviewModule {}
