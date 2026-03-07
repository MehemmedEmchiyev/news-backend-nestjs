import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

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
}