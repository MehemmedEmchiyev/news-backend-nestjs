import { Body, Controller, Ip, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login-user.dto";
import type { AuthorizedUser } from "./auth.types";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuards } from "src/guards/auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    login(@Body() params: LoginDto) {
        return this.authService.login(params)
    }

    @Post('register')
    register(
        @Body() params: CreateUserDto
    ) {
        return this.authService.register(params)
    }

    @Post('guest')
    guest(@Ip() userIp: string) {
        return this.authService.guest(userIp)
    }

    @Post('resetPassword')
    @ApiBearerAuth()
    @UseGuards(AuthGuards)
    resetPassword(
        @Req() req: AuthorizedUser,
        @Body() body: ResetPasswordDto
    ) {
        return this.authService.resetPassword(req.user.id, body)
    }
}