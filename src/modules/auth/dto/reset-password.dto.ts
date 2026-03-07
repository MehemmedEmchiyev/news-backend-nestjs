import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, Length } from "class-validator";

export class ResetPasswordDto {
    @Type()
    @IsString()
    @Length(6, 50)
    @ApiProperty({ default: "currentPassword" })
    currentPassword: string

    @Type()
    @IsString()
    @Length(6, 50)
    @ApiProperty({ default: "newPassword" })
    newPassword: string

    @Type()
    @IsString()
    @Length(6, 50)
    @ApiProperty({ default: "repeatPassword" })
    repeatPassword: string

}