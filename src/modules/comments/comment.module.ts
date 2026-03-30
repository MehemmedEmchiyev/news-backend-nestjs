import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntitiy } from "src/entities/Comment.entity";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { NewsEntity } from "src/entities/News.entity";
import { UserEntity } from "src/entities/User.entity";
import { UserModule } from "../users/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([CommentEntitiy, NewsEntity, UserEntity]), UserModule],
    controllers: [CommentController],
    providers: [CommentService]
})

export class CommentModule { }