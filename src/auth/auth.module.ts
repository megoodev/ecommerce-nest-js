import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CryptographyService } from 'src/common-module/cryptography/Cryptography.service';
import { ResendModule } from 'nestjs-resend';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CryptographyService],
  imports: [
    DatabaseModule,
    ResendModule.forRoot({
        apiKey: process.env.RESEND_API_KEY,
    }),
  ],
})
export class AuthModule {}
