import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/User.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from "bcrypt"
import { LoginDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { hash, randomBytes } from "crypto";
import { AuthProviderEnum, RoleEnum } from "../users/user.types";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import config from "src/config";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
@Injectable()
export class AuthService {
    private readonly firebaseApp: App;

    constructor(
        @InjectRepository(UserEntity)
        private authRepo: Repository<UserEntity>,
        private jwtService: JwtService
    ) {
        this.firebaseApp = this.initializeFirebaseApp();
    }

    private initializeFirebaseApp() {
        if (getApps().length) return getApps()[0];

        const { projectId, clientEmail, privateKey } = config.firebase;
        if (!projectId || !clientEmail || !privateKey) {
            throw new InternalServerErrorException("Firebase credentials are missing in .env");
        }

        return initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    }

    async login(params: LoginDto) {
        let existUser = await this.authRepo.findOne({ where: { email: params.email } })

        if (!existUser) throw new UnauthorizedException("Username or password is wrong")

        let checkPassword = await bcrypt.compare(params.password, existUser.password)

        if (!checkPassword) throw new UnauthorizedException("Username or password is wrong")

        let token = this.jwtService.sign({ userId: existUser.id })

        return {
            message: "Login is Succesfully",
            token,
            user: {
                ...existUser,
                password: undefined
            }
        }

    }
    async register(params: CreateUserDto) {
        let existUser = await this.authRepo.findOne({
            where: {
                username: params.username,
                email: params.email
            }
        })

        if (existUser) throw new ConflictException("Username or email already exist !")
        let password = await bcrypt.hash(params.password, 10)
        let userData = {
            ...params,
            password,
            provider: AuthProviderEnum.PASSWORD,
        }
        let user = this.authRepo.create(userData)
        await user.save()

        return {
            message: "Register is succesfully",
            user: {
                ...user,
                password: undefined
            }
        }

    }

    async googleLogin(idToken: string) {
        const decoded = await getAuth(this.firebaseApp).verifyIdToken(idToken);
        const email = decoded.email;

        if (!email) throw new UnauthorizedException("Google account email is missing");

        let existUser = await this.authRepo.findOne({ where: { email } });

        if (!existUser) {
            existUser = this.authRepo.create({
                email,
                username: `google_${decoded.uid}`,
                fullName: decoded.name || undefined,
                photoUrl: decoded.picture || undefined,
                password: randomBytes(32).toString("hex"),
                role: RoleEnum.USER,
                provider: AuthProviderEnum.GOOGLE,
            });
            await existUser.save();
        } else if (existUser.provider !== AuthProviderEnum.GOOGLE) {
            existUser.provider = AuthProviderEnum.GOOGLE;
            await existUser.save();
        }

        const token = this.jwtService.sign({ userId: existUser.id });

        return {
            message: "Google login is succesfully",
            token,
            user: {
                ...existUser,
                password: undefined,
            },
        };
    }

    async guest(ip: string) {
        let random = hash("md5", ip)
        let userName = `user_${ip}_${random}`
        let email = `user${ip}@gmail.com`
        let user = await this.authRepo.findOne({
            where: {
                username: userName
            }
        })

        if (!user) {
            user = this.authRepo.create(
                {
                    username: userName,
                    email,
                    password: random,
                    role: RoleEnum.USER,
                    provider: AuthProviderEnum.GUEST,
                }
            )
            await user.save()
        } else if (user.provider !== AuthProviderEnum.GUEST) {
            user.provider = AuthProviderEnum.GUEST;
            await user.save();
        }

        let token = this.jwtService.sign({ userId: user.id })

        return {
            token,
            user
        }
    }

    async resetPassword(id: number, params: ResetPasswordDto) {
        let user = await this.authRepo.findOne({
            where: {
                id
            }
        })

        if (!user) throw new UnauthorizedException("Unauthorized")

        let checkPassword = await bcrypt.compare(params.currentPassword, user.password)

        if (!checkPassword) throw new BadRequestException('Current Password is not valid')

        if (params.newPassword !== params.repeatPassword) throw new BadRequestException('New Password is not equal to Repeat Password')

        let newPassword = await bcrypt.hash(params.newPassword, 10)
        await this.authRepo.update({ id }, { password: newPassword })
        return { 
            message : "Password is updated succesfully"
        }
    }

}