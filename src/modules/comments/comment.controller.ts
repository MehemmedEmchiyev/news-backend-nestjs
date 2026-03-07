import { Body, Controller, Param, Post } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentDto } from "./dto/comment.dto";

@Controller('news/:id/comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @Post()
    create(
        @Body() body: CommentDto,
        @Param("id") id: number
    ) {
        return this.commentService.create(id, body)
    }

}