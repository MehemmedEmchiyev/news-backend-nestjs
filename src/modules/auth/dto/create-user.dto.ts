import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, Length } from "class-validator"
import { UserGenderEnum } from "src/modules/users/user.types"

export class CreateUserDto {

    @Type()
    @IsUrl()
    @IsOptional()
    @ApiProperty({ default: 'https://th.bing.com/th/id/R.b2b34517339101a111716be1c203f354?rik=e5WHTShSpipi3Q&pid=ImgRaw&r=0' })
    photoUrl: string
    
    
    @Type()
    @IsString()
    @Length(4, 20)
    @ApiProperty()
    username: string

    @Type()
    @IsEmail()
    @ApiProperty()
    email: string

    @Type()
    @IsString()
    @Length(6, 50)
    @ApiProperty()
    password: string

    @Type()
    @IsEnum(UserGenderEnum)
    @ApiProperty()
    gender: UserGenderEnum

    @Type()
    @IsString()
    @IsOptional()
    @ApiProperty()
    fullName?: string
}