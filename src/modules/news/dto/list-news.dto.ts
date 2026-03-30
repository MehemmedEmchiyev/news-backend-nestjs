import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export class NewsListDto {

    @Transform(({ value }) => value === "true")
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ default: false, required: false })
    popular: boolean

    @Transform(({ value }) => value === "true")
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ default: false, required: false })
    top: boolean

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(1)
    @ApiProperty({ required: false, default: 1 })
    page?: number

    @Type()
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    @ApiProperty({ required: false, default: 10 })
    limit?: number
}