import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NewsEntity } from "./News.entity";

@Entity("categories")
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    slug: string

    @OneToMany(() => NewsEntity , (news) => news.category)
    news : NewsEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAd: Date
}