import {QueryRepo} from "../QueryRepo.class";
import {BlogService} from "./BlogService.class";
import {TypeBlogInput} from "../../settings/types/blog.types";
import {Request,Response} from "express";
import {TypePostInputForBlog} from "../../settings/types/post.types";
import {httpStatus} from "../../settings/types/httpStatuses";
import {paginationHelper} from "../../core/helpers/pagination.helper";
import {IPAginationAndSorting} from "../../settings/types/pagination.types";

export class BlogHandler {
    constructor(private queryRepo: QueryRepo,
                private blogService: BlogService) {}
    async createBlog(req: Request, res: Response){
        const input:TypeBlogInput = req.body;
        const result = await this.blogService.createBlog(input);
    }
    async createPostForSpecificBlog(req: Request, res: Response){
        const blogId = req.params.blogId;
        const input: TypePostInputForBlog = req.body;
        const result = await this.blogService.createPostForSpecificBlog(blogId, input);
        if(result.status !== httpStatus.Created){
            res.sendStatus(result.status);
            return
        }
        res.status(result.status).send(result.data);
    }

    async changeBlogById(req: Request, res: Response){
        const blogId = req.params.id;
        const input: TypeBlogInput = req.body;
        const result = await this.blogService.changeBlog(blogId, input);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(result.status)
    }

    async findSpecificBlogById(req: Request, res: Response){
        const blogId = req.params.id;
        const blog = await this.queryRepo.findSpecificBlog(blogId);
        if(!blog){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(blog);
    }
    async findPostsForSpecificBlogId(req: Request, res: Response){
        const blogId = req.params.blogId;
        const query:Partial<IPAginationAndSorting> = req.query;
        const filter = paginationHelper(query);
        const postList = await this.queryRepo.findPostsForSpecificBlog(blogId, filter);
        if(!postList){
            res.sendStatus(httpStatus.NotFound);
            return
        }
        res.status(httpStatus.Ok).send(postList);
    }
    async findBlogsByFilter(req: Request, res: Response){
        const query:Partial<IPAginationAndSorting> = req.query;
        const filter = paginationHelper(query);
        const blogsList = await this.queryRepo.findBlogsByFilter(filter);
        res.status(httpStatus.Ok).send(blogsList);
    }

    async deleteSpecificBlog(req: Request, res: Response){
        const blogId = req.params.id;
        const result = await this.blogService.deleteSpecificBlog(blogId);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }
}