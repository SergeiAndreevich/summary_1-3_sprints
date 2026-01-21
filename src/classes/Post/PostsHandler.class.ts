import {Request, Response} from "express";
import {TypePostInput} from "../../settings/types/post.types";
import {PostsService} from "./PostsService.class";
import {httpStatus} from "../../settings/types/httpStatuses";
import {TypeCommentInput} from "../../settings/types/comment.types";
import {TypeReactionInput} from "../../settings/types/reaction.types";
import {paginationHelper} from "../../core/helpers/pagination.helper";
import {IPAginationAndSorting} from "../../settings/types/pagination.types";
import {inject, injectable} from "inversify";

@injectable()
export class PostHandler{
    constructor(@inject(PostsService) private postsService: PostsService) {}
    async createPost(req:Request, res: Response){
        const input:TypePostInput = req.body;
        const result = await this.postsService.createPost(input);
        if(result.status !== httpStatus.Created){
            res.sendStatus(httpStatus.ExtraError);
            return;
        }
        res.status(httpStatus.Created).send(result.data);
    }
    async createCommentForSpecificPostId(req:Request, res: Response){
        const postId = req.params.postId;
        const input:TypeCommentInput = req.body;
        const userId = req.userId;
        const result = await this.postsService.createCommentForSpecificPost(postId, input, userId!);
        if(result.status !== httpStatus.Created){
            res.sendStatus(result.status);
            return
        }
        res.status(httpStatus.Created).send(result.data);
    }

    async updatePostById(req:Request, res: Response){
        const postId = req.params.id;
        const input:TypePostInput = req.body;
        const result = await this.postsService.updatePostById(postId, input);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.status(httpStatus.NoContent)
    }
    async changeReactionByPostId(req:Request, res: Response){
        const postId = req.params.postId;
        const userId = req.userId;
        const input:TypeReactionInput = req.body;
        const result = await this.postsService.changeReactionByPostId(postId, userId!, input);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }

    async findPostById(req:Request, res: Response){
        const postId = req.params.id;
        const userId = req.userId;
        const result = await this.postsService.findPostById(postId, userId);
        if(result.status !== httpStatus.Ok){
            res.sendStatus(result.status);
            return
        }
        res.status(httpStatus.Ok).send(result.data);
    }
    async findCommentsByPostId(req:Request, res: Response){
        const postId = req.params.postId;
        const userId = req.userId;
        const query: Partial<IPAginationAndSorting> = req.query;
        const filter = paginationHelper(query);
        const result = await this.postsService.findCommentsByPostId(postId, filter, userId);
        if(result.status !== httpStatus.Ok){
            res.sendStatus(result.status);
            return
        }
        res.status(httpStatus.Ok).send(result.data)
    }
    async findPostsByFilter(req:Request, res: Response){
        const query: Partial<IPAginationAndSorting> = req.query;
        const filter =  paginationHelper(query);
        const userId = req.userId;
        const result = await this.postsService.findPostsByFilter(filter, userId);
        res.status(httpStatus.Ok).send(result.data);
    }

    async removePostById(req:Request, res: Response){
        const postId = req.params.id;
        const result = await this.postsService.removePostById(postId);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
        }
        res.sendStatus(httpStatus.NoContent)
    }
}