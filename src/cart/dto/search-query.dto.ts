import { IsOptional, IsUUID } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @IsUUID()
  userId: string;
}
