import { RoleEnum, UserGenderEnum } from "src/modules/users/user.types";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    photoUrl: string

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum

    @Column({ default: UserGenderEnum.MALE })
    gender: UserGenderEnum

    @Column({ nullable: true })
    fullName: string
}