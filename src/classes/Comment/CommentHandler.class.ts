import {Request,Response} from "express";
import {QueryRepo} from "../QueryRepo.class";
import {TypeCommentInput} from "../../settings/types/comment.types";
import {CommentService} from "./CommentService.class";
import {httpStatus} from "../../settings/types/httpStatuses";
import {TypeReactionInput} from "../../settings/types/reaction.types";
import {inject, injectable} from "inversify";

@injectable()
export class CommentHandler {
    constructor(@inject(CommentService) private commentService: CommentService) {}

    async changeCommentByCommentId(req: Request, res: Response) {
        const userId = req.userId;
        const commentId = req.params.commentId;
        const input: TypeCommentInput = req.body;
        const result = await this.commentService.changeCommentByCommentId(commentId, input, userId!);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }
    async changeCommentReaction(req: Request, res: Response) {
        const userId = req.userId;
        const commentId = req.params.commentId;
        const input:TypeReactionInput =  req.body;
        const result = await this.commentService.changeCommentReaction(commentId, input, userId!);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }

    async findCommentById(req: Request, res: Response) {
        const userId = req.userId;
        const commentId = req.params.id;
        const result = await this.commentService.findCommentById(commentId, userId);
        if(result.status !== httpStatus.Ok){
            res.sendStatus(result.status);
            return
        }
        res.status(httpStatus.Ok).send(result.data)
    }

    async removeCommentByCommentId(req:Request,res:Response){
        const userId = req.userId;
        const commentId = req.params.commentId;
        const result = await this.commentService.removeCommentByCommentId(commentId, userId!);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }
}