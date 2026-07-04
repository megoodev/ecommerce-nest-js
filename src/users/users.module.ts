import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CryptographyService } from 'src/common-module/cryptography/Cryptography.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CryptographyService],
  imports: [DatabaseModule],
})
export class UsersModule {}
