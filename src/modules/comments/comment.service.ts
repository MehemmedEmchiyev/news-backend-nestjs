import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntitiy } from "src/entities/Comment.entity";
import { Repository } from "typeorm";
import { CommentDto } from "./dto/comment.dto";
import { NewsEntity } from "src/entities/News.entity";
import { UserEntity } from "src/entities/User.entity";
import { RoleEnum } from "../users/user.types";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntitiy)
        private commentRepo: Repository<CommentEntitiy>,
        @InjectRepository(NewsEntity)
        private newsService: Repository<NewsEntity>
    ) { }
    async create(id: number, params: CommentDto, userId: number) {
        let news = await this.newsService.findOne({
            where: {
                id
            }
        })
        if (!news) throw new NotFoundException("News is not found")

        let comment = this.commentRepo.create({ ...params, newsId : id, userId })

        await comment.save()

        return {
            message: "Comment added succesfully"
        }
    }



    async update(newsId: number, commentId: number, user: UserEntity, body: CommentDto) {
        const exist = await this.commentRepo.findOne({ where: { id: commentId, newsId } })
        if (!exist) throw new NotFoundException("Comment is not found")

        const isOwner = exist.userId === user.id
        const isAdmin = user.role === RoleEnum.ADMIN
        if (!isOwner && !isAdmin) throw new ForbiddenException("Forbidden")

        await this.commentRepo.update({ id: commentId }, { content: body.content })
        return { message: "Comment updated succesfully" }
    }

    async delete(newsId: number, commentId: number, user: UserEntity) {
        const exist = await this.commentRepo.findOne({ where: { id: commentId, newsId } })
        if (!exist) throw new NotFoundException("Comment is not found")

        const isOwner = exist.userId === user.id
        const isAdmin = user.role === RoleEnum.ADMIN
        if (!isOwner && !isAdmin) throw new ForbiddenException("Forbidden")

        await this.commentRepo.delete({ id: commentId })
        return { message: "Comment deleted succesfully" }
    }
}