import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewsEntity } from "./News.entity";
import { UserEntity } from "./User.entity";

@Entity('comments')
export class CommentEntitiy extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string

    @Column({ nullable: true })
    newsId: number

    @ManyToOne(() => NewsEntity, (news) => news.comments)
    @JoinColumn({ name: "newsId" })
    news: NewsEntity

    @Column({ nullable: true })
    userId: number

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "userId" })
    user: UserEntity
}