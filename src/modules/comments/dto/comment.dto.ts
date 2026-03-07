import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CommentDto {
    @Type()
    @IsString()
    @ApiProperty({ default: "comment" })
    @MinLength(10)
    content: string
}