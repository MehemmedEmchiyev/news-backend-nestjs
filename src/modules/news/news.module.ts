import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsEntity } from "src/entities/News.entity";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { UserService } from "../users/user.service";
import { UserModule } from "../users/user.module";
import { NewsActionEntity } from "src/entities/NewsAction.entity";
import { CategoryModule } from "../category/category.module";

@Module({
    imports: [TypeOrmModule.forFeature([NewsEntity, NewsActionEntity]), UserModule, CategoryModule],
    controllers: [NewsController],
    providers: [NewsService]
})
export class NewsModule { }
