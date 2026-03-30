import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuards } from "src/guards/auth.guard";
import { Roles } from "src/shared/decorator/role.decorator";
import type { AuthorizedUser } from "../auth/auth.types";
import { RoleEnum } from "../users/user.types";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { NewsService } from "./news.service";
import { NewsActionTypes } from "./news.types";
import { NewsListDto } from "./dto/list-news.dto";

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Get()
    list(
        @Query() query: NewsListDto
    ) {
        return this.newsService.list(query)
    }

    @Get('category/:id')
    getNewsByCategoryId(
        @Param("id") id: number
    ) {
        return this.newsService.getNewsByCategoryId(id)
    }

    @Get(':id')
    getNews(@Param("id") id: number) {
        return this.newsService.getNews(id)
    }

    @Post()
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()

    create(
        @Body() body: CreateNewsDto
    ) {
        return this.newsService.create(body)
    }

    @Post(':id')
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    update(
        @Body() body: UpdateNewsDto,
        @Param("id") newsId: number
    ) {
        return this.newsService.update(newsId, body)
    }

    @Post('pin/:id')
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    pin(
        @Param("id") id : number
    ) {
        return this.newsService.newsPin(id)
    }

    @Delete(":id")
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    delete(
        @Param("id") id: number
    ) {
        return this.newsService.delete(id)
    }
    @Delete()
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    deleteAll() {
        return this.newsService.deleteAll()
    }

    @Post('action/:id/:type')
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.USER)
    @ApiBearerAuth()
    action(
        @Param("id") id: number,
        @Param("type") type: NewsActionTypes,
        @Req() req: AuthorizedUser,
    ) {
        return this.newsService.action(req.user.id, id, type)
    }


}