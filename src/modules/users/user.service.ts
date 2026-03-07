import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/User.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/UpdateUser.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>
    ) { }

    findUserById(id: number) {
        return this.userRepo.findOne({
            where: {
                id
            }
        })
    }

    list() {
        return this.userRepo.find()
    }

    async updateUser(id: number, params: UpdateUserDto) {
        let user = await this.userRepo.findOne({ where: { id } })

        if (!user) throw new UnauthorizedException("Unauthorized")

        await this.userRepo.update({ id }, params)

        return {
            message: "Profile updated succesfully"
        }
    }
}