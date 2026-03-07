import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateCategoryDto {
    @Type()
    @IsString()
    @MinLength(3)
    @ApiProperty({default : "category"})
    title: string

    @Type()
    @IsString()
    @MinLength(3)
    @IsOptional()
    @ApiProperty({default : "slug-data"})
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    slug: string
}