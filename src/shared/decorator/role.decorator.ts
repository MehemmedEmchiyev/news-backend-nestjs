import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "src/modules/users/user.types";

export const Roles = (...roles: RoleEnum[]) => SetMetadata("roles", roles)