import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { AuthGuards } from "src/guards/auth.guard";
import { Roles } from "src/shared/decorator/role.decorator";
import { RoleEnum } from "../users/user.types";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
    constructor(private uploadService: UploadService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuards)
    @Roles(RoleEnum.ADMIN)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
            required: ["file"],
        },
    })
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException("File is required");
        }

        const result = await this.uploadService.uploadImage(file) as any;

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
}
