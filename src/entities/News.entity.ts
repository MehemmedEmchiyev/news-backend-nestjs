import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CategoryEntity } from "./Category.entity";
import { CommentEntitiy } from "./Comment.entity";

@Entity("news")
export class NewsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    slug: string

    @Column()
    thumbnail: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ default: 0 })
    like: number

    @Column({ default: 0 })
    dislike: number

    @Column({ default: 0 })
    views: number

    @Column({ nullable: true })
    categoryId: number

    @OneToMany(() => CommentEntitiy, (comments) => comments.news)
    comments: CommentEntitiy[]

    @ManyToOne(() => CategoryEntity, (category) => category.news)
    @JoinColumn({ name: "categoryId" })
    category: CategoryEntity
}