import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ResendModule } from 'nestjs-resend';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
