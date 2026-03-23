import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import config from "src/config";

@Injectable()
export class UploadService {
    constructor() {
        cloudinary.config(config.cloudinary);
    }

    uploadImage(file: Express.Multer.File) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "news" },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result);
                },
            );

            stream.end(file.buffer);
        });
    }
}
