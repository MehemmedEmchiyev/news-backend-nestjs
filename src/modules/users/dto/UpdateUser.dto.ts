import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsOptional, IsString, IsUrl, Length } from "class-validator"
import { UserGenderEnum } from "src/modules/users/user.types"
export class UpdateUserDto {
    @Type()
    @IsUrl()
    @IsOptional()
    @ApiProperty({ default: 'https://th.bing.com/th/id/R.b2b34517339101a111716be1c203f354?rik=e5WHTShSpipi3Q&pid=ImgRaw&r=0' })
    photoUrl : string

    @Type()
    @IsString()
    @Length(4, 20)
    @ApiProperty()
    @IsOptional()
    username: string

    @Type()
    @IsEnum(UserGenderEnum)
    @ApiProperty()
    @IsOptional()
    gender: UserGenderEnum

    @Type()
    @IsString()
    @IsOptional()
    @ApiProperty()
    @IsOptional()
    fullName?: string
}