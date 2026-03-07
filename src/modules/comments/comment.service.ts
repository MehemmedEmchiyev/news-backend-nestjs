import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntitiy } from "src/entities/Comment.entity";
import { Repository } from "typeorm";
import { CommentDto } from "./dto/comment.dto";
import { NewsEntity } from "src/entities/News.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntitiy)
        private commentRepo: Repository<CommentEntitiy>,
        @InjectRepository(NewsEntity)
        private newsService: Repository<NewsEntity>
    ) { }
    async create(id: number, params: CommentDto) {
        let news = await this.newsService.findOne({
            where: {
                id
            }
        })
        if (!news) throw new NotFoundException("News is not found")

        let comment = this.commentRepo.create({ ...params, newsId : id })

        await comment.save()

        return {
            message: "Comment added succesfully"
        }
    }

}