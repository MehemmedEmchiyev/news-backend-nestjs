import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsUrl, Length, Matches, Min, MinLength } from "class-validator";

export class CreateNewsDto {
    @Type()
    @IsString()
    @ApiProperty({ default: "title" })
    @Length(10, 200)
    title: string

    @Type()
    @IsString()
    @MinLength(5)
    @ApiProperty({ default: "minimum content" })
    content: string

    @Type()
    @IsString()
    @ApiProperty({ default: 'slug-data' })
    @IsOptional()
    slug?: string;

    @Type()
    @IsNumber()
    @Min(1)
    @ApiProperty({ default: 1 })
    categoryId: number

    @Type()
    @IsUrl()
    @ApiProperty({
        default:
            'https://images.unsplash.com/photo-1735597693189-9ba81b5bbc83?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    })
    thumbnail: string;
}