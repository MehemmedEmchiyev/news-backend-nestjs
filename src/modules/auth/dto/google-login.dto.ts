import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class GoogleLoginDto {
    @Type()
    @IsString()
    @MinLength(10)
    @ApiProperty({
        description: "Firebase ID token from Google sign-in",
    })
    idToken: string;
}
