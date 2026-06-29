import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, DatabaseModule, ConfigModule.forRoot({
    isGlobal: true,
    
  }), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
