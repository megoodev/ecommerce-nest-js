import { Module } from '@nestjs/common';
import { SubliersService } from './subliers.service';
import { SubliersController } from './subliers.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SubliersController],
  providers: [SubliersService],
  imports: [DatabaseModule],
})
export class SubliersModule {}
