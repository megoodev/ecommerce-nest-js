import { IsString, IsUUID, Length } from 'class-validator';
import { type UUID } from 'crypto';

export class subCategoryDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsString()
  @IsUUID('all')
  categoryId: UUID;
}
