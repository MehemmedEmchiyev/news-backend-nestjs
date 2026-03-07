import { NewsActionTypes } from "src/modules/news/news.types";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("news_action")
export class NewsActionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column()
    newsId: number

    @Column()
    type: NewsActionTypes
}