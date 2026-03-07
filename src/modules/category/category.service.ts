import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "src/entities/Category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { watch } from "fs/promises";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>
    ) { }

    findCategoryById(categoryId: number) {
        return this.categoryRepo.findOne({
            where: {
                id: categoryId
            }
        })
    }

    list() {
        return this.categoryRepo.find()
    }

    async create(params: CreateCategoryDto) {
        if (!params.slug) {
            params.slug = params.title.split(" ").map((item: string) => item.toLocaleLowerCase()).join("-")
        }
        let category = this.categoryRepo.create(params)
        await category.save()
        return {
            message: "Category is created succesfully",
            category
        }
    }

    async update(id: number, params: UpdateCategoryDto) {
        let checkCategory = await this.categoryRepo.findOne({
            where: { id }
        })

        if (!checkCategory) throw new NotFoundException("Category is not found ! ")

        await this.categoryRepo.update({ id }, params)

        return {
            message: "Category is updated succesfully"
        }
    }

    async delete(id: number) {
        let checkCategory = await this.categoryRepo.findOne({
            where: { id }
        })

        if (!checkCategory) throw new NotFoundException("Category is not found ! ")

        await this.categoryRepo.delete({ id })

        return {
            message: "Category is deleted"
        }
    }

    async deleteAll() {
        await this.categoryRepo.deleteAll()
        return {
            message: "All category is deleted"
        }
    }

}