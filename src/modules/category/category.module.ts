import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "src/entities/Category.entity";
import { CommentEntitiy } from "src/entities/Comment.entity";
import { NewsEntity } from "src/entities/News.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { UserModule } from "../users/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity, NewsEntity, CommentEntitiy]), UserModule],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})
export class CategoryModule { }