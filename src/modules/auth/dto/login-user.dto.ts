import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, Length, Min } from "class-validator";

export class LoginDto {
    @Type()
    @IsEmail()
    @ApiProperty({default : 'example@gmail.com'})
    email : string

    @Type()
    @IsString()
    @Length(6 , 50)
    @ApiProperty({default : '123456789'})
    password : string
}