import { Module } from '@nestjs/common';
import { CryptographyModule } from './cryptography/cryptography.module';

@Module({
  imports: [CryptographyModule],
})
export class CommonModule {}
