import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentDto } from "./dto/comment.dto";
import { AuthGuards } from "src/guards/auth.guard";
import { Roles } from "src/shared/decorator/role.decorator";
import { RoleEnum } from "../users/user.types";
import type { AuthorizedUser } from "../auth/auth.types";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('news/:id/comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Post()
    @UseGuards(AuthGuards)
    @ApiBearerAuth()
    @Roles(RoleEnum.USER, RoleEnum.ADMIN)
    create(
        @Body() body: CommentDto,
        @Param("id") id: number,
        @Req() req: AuthorizedUser
    ) {
        return this.commentService.create(id, body, req.user.id)
    }

    @Patch(':commentId')
    @UseGuards(AuthGuards)
    @ApiBearerAuth()
    @Roles(RoleEnum.USER, RoleEnum.ADMIN)
    update(
        @Param("id") newsId: number,
        @Param("commentId") commentId: number,
        @Body() body: CommentDto,
        @Req() req: AuthorizedUser
    ) {
        return this.commentService.update(newsId, commentId, req.user, body)
    }

    @Delete(':commentId')
    @UseGuards(AuthGuards)
    @ApiBearerAuth()
    @Roles(RoleEnum.USER, RoleEnum.ADMIN)
    delete(
        @Param("id") newsId: number,
        @Param("commentId") commentId: number,
        @Req() req: AuthorizedUser
    ) {
        return this.commentService.delete(newsId, commentId, req.user)
    }
}