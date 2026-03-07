import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { AuthGuards } from "src/guards/auth.guard";
import { Roles } from "src/shared/decorator/role.decorator";
import { RoleEnum } from "../users/user.types";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("category")
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Get()
    list() {
        return this.categoryService.list()
    }

    @Post()
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    create(
        @Body() body: CreateCategoryDto
    ) {
        return this.categoryService.create(body)
    }

    @Post(":id")
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    update(
        @Body() body: UpdateCategoryDto,
        @Param("id") id: number
    ) {
        return this.categoryService.update(id, body)
    }


    @Delete(":id")
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    delete(@Param("id") id: number) {
        return this.categoryService.delete(id)
    }


    @Delete()
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiBearerAuth()
    deleteAll() {
        return this.categoryService.deleteAll()
    }
}