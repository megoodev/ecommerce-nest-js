import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TaxController],
  providers: [TaxService],
  imports: [DatabaseModule],
})
export class TaxModule {}
