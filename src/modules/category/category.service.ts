import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "src/entities/Category.entity";
import { CommentEntitiy } from "src/entities/Comment.entity";
import { NewsEntity } from "src/entities/News.entity";
import { In, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>,
        @InjectRepository(NewsEntity)
        private newsRepo: Repository<NewsEntity>,
        @InjectRepository(CommentEntitiy)
        private commentRepo: Repository<CommentEntitiy>
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

        const newsList = await this.newsRepo.find({
            where: { categoryId: id },
            select: ["id"]
        })
        const newsIds = newsList.map((news) => news.id)

        if (newsIds.length > 0) {
            await this.commentRepo.delete({ newsId: In(newsIds) })
        }

        await this.newsRepo.delete({ categoryId: id })
        await this.categoryRepo.delete({ id })

        return {
            message: "Category is deleted"
        }
    }

    async deleteAll() {
        const allNews = await this.newsRepo.find({
            select: ["id"]
        })
        const newsIds = allNews.map((news) => news.id)

        if (newsIds.length > 0) {
            await this.commentRepo.delete({ newsId: In(newsIds) })
        }

        await this.newsRepo.createQueryBuilder().delete().from(NewsEntity).execute()
        await this.categoryRepo.createQueryBuilder().delete().from(CategoryEntity).execute()
        return {
            message: "All category is deleted"
        }
    }

}