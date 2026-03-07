import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "src/modules/users/user.service";
import { RoleEnum } from "src/modules/users/user.types";

@Injectable()

export class AuthGuards implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private userService: UserService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()

        const token = request.headers.authorization?.split(" ")[1] || ''

        if (!token) throw new UnauthorizedException("unauthorization")

        try {
            const payload = await this.jwtService.verify(token)

            const user = await this.userService.findUserById(payload?.userId)

            let roles: RoleEnum[] | undefined = await this.reflector.get('roles', context.getHandler())
            if (user && roles && !roles.includes(user.role)) {
                throw new ForbiddenException('Forbidden');
            }

            request['user'] = user
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException('Forbidden');
            }
            throw new UnauthorizedException("unauthorization")
        }
        return true
    }

}