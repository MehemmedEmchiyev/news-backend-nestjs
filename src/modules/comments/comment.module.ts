import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntitiy } from "src/entities/Comment.entity";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { NewsModule } from "../news/news.module";
import { NewsEntity } from "src/entities/News.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntitiy, NewsEntity])],
    controllers: [CommentController],
    providers: [CommentService]
})

export class CommentModule { }