import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/News.entity";
import { NewsActionEntity } from "src/entities/NewsAction.entity";
import { FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";
import { CategoryService } from "../category/category.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { NewsActionTypes } from "./news.types";
import { NewsListDto } from "./dto/list-news.dto";

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsEntity)
        private newsRepo: Repository<NewsEntity>,
        @InjectRepository(NewsActionEntity)
        private newsActionRepo: Repository<NewsActionEntity>,

        private categoryService: CategoryService
    ) { }
    list(query: NewsListDto) {
        let order: FindOptionsOrder<NewsEntity> = { isPin: "DESC" }
        let where: FindOptionsWhere<NewsEntity> = {}
        if (query.popular) {
            order.views = "DESC"
        }
        if (query.top) {
            order.like = "DESC"
        }

        const page = query.page ?? 1
        const limit = query.limit ?? 10
        const skip = (page - 1) * limit

        return this.newsRepo.findAndCount({
            where,
            order,
            relations: ["category"],
            select: ["id", "title", "createdAt", "thumbnail", "updatedAt", "slug", "like", "views", "dislike", "categoryId", "isPin"],
            take: limit,
            skip
        }).then(([items, total]) => ({
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }))
    }

    async getNews(id: number) {
        let news = await this.newsRepo.findOne({
            where: { id: id },
            relations: ["category", "comments", "comments.user"],
            select: {
                id: true,
                title: true,
                content: true,
                slug: true,
                thumbnail: true,
                createdAt: true,
                updatedAt: true,
                like: true,
                dislike: true,
                views: true,
                category: {
                    id: true,
                    title: true
                },
                comments: {
                    id: true,
                    content: true,
                    newsId: true,
                    userId: true,
                    user: {
                        id: true,
                        username: true,
                        fullName: true,
                        photoUrl: true
                    }
                }
            }
        })
        if (!news) throw new NotFoundException("News is not found ! ")

        return {
            news
        }
    }

    async create(params: CreateNewsDto) {

        if (!params.slug) {
            params.slug = params.title.split(" ").map((item: string) => item.toLocaleLowerCase()).join("-")
        }

        let category = await this.categoryService.findCategoryById(params.categoryId)

        if (!category) throw new NotFoundException("Category is not found")

        let news = this.newsRepo.create(params)
        await news.save()

        return {
            message: "News is created succesfully",
            news
        }
    }

    async update(newsId: number, params: UpdateNewsDto) {
        let news = await this.newsRepo.findOne({
            where: {
                id: newsId
            }
        })

        if (params.categoryId) {
            let category = await this.categoryService.findCategoryById(params.categoryId)
            if (!category) throw new NotFoundException("Category is not found")
        }

        if (!news) throw new NotFoundException("News is not found")


        await this.newsRepo.update({ id: newsId }, params)

        return {
            message: "News is updated succesfully"
        }
    }

    async delete(id: number) {
        let result = await this.newsRepo.delete({ id })

        if (!result.affected) {
            throw new NotFoundException("News is not found")
        }

        return {
            message: "News is deleted succesfully"
        }
    }

    async deleteAll() {
        await this.newsRepo.deleteAll()

        return {
            message: "All news is deleted"
        }
    }

    async action(userId: number, newsId: number, type: NewsActionTypes) {

        let existNews = await this.newsRepo.findOne({
            where: {
                id: newsId
            }
        })
        if (!existNews) throw new NotFoundException("News is not found")

        const existAction = await this.newsActionRepo.findOne({
            where: {
                newsId,
                userId
            }
        })
        if (type == NewsActionTypes.VIEWS) {
            await this.newsRepo.increment({ id: newsId }, "views", 1)

            return {
                message: "View is completed"
            }
        }
        if (existAction) {
            if (existAction.type === type) {
                await this.newsRepo.decrement({ id: newsId }, type === NewsActionTypes.LIKE ? "like" : "dislike", 1)
                await this.newsActionRepo.delete({ id: existAction.id })
                return { message: "Action is removed" }
            } else {
                await this.newsRepo.decrement({ id: newsId }, existAction.type === NewsActionTypes.LIKE ? "like" : "dislike", 1)
                await this.newsRepo.increment({ id: newsId }, type === NewsActionTypes.LIKE ? "like" : "dislike", 1)

                existAction.type = type
                await existAction.save()
                return { message: `${type} is completed` }
            }
        }
        await this.newsActionRepo.save(this.newsActionRepo.create({ newsId, userId, type }))
        await this.newsRepo.increment({ id: newsId }, type === NewsActionTypes.LIKE ? "like" : "dislike", 1)

        return { message: `${type} is completed` }
    }

    async getNewsByCategoryId(categoryId: number) {
        const news = this.newsRepo.find({
            where: {
                category: { id: categoryId }
            },
            relations: ["category"]
        })

        return news
    }

    async newsPin(id: number) {
        const news = await this.newsRepo.findOne({ where: { id } })
        if (!news) throw new NotFoundException('News is not found')
        let message = !news.isPin ? `News pined` : 'Pin removed'

        await this.newsRepo.update({ id }, { isPin: news.isPin ? false : true })
        return {
            message
        }
    }


}