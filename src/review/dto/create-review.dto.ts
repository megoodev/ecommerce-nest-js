import { IsNumber, IsOptional, IsString, IsUUID, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    content?: string;
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;
    @IsString()
    @IsUUID()
    productId:string;
}
