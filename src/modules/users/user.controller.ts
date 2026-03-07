import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuards } from "src/guards/auth.guard";
import { Roles } from "src/shared/decorator/role.decorator";
import { RoleEnum } from "./user.types";
import type { AuthorizedUser } from "../auth/auth.types";
import { UpdateUserDto } from "./dto/UpdateUser.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }


    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    list() {
        return this.userService.list()
    }

    @Post('me')
    @ApiBearerAuth()
    @UseGuards(AuthGuards)
    updateProfile(
        @Req() req: AuthorizedUser,
        @Body() body: UpdateUserDto,
    ) {
        return this.userService.updateUser(req.user.id, body)
    }
}