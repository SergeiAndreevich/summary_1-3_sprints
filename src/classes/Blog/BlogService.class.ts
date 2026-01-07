import {BlogRepo} from "./BlogRepo.class";
import {TypeBlogFrontView, TypeBlogInput} from "../../settings/types/blog.types";
import {IResult} from "../../settings/types/resultObject";
import {httpStatus} from "../../settings/types/httpStatuses";
import {TypePostInputForBlog} from "../../settings/types/post.types";

export class BlogService {
    constructor(private blogRepo: BlogRepo) {}
    async createBlog(dto:TypeBlogInput):Promise<IResult<null | TypeBlogFrontView>>{
        const blogForView = await this.blogRepo.createBlog(dto);
        if(!blogForView){
            return {data: null, status: httpStatus.ExtraError, error: {field: 'database', message: 'blog not created'}};
        }
        return {data: blogForView, status: httpStatus.Created}
    }
    async createPostForSpecificBlog(blogId: string, input: TypePostInputForBlog){
        const blog = await this.blogRepo.findBlogById(blogId);
        if(!blog){
            return {data: null, status: httpStatus.NotFound, error: {field: 'blogId',  message: 'blog not found'}};
        }
        const createdPost = await this.blogRepo.createPostForSpecificBlog(blog.id, blog.name, input);
        return  {data: createdPost, status: httpStatus.Created}
    }
    async changeBlog(blogId: string, input: TypeBlogInput){
        const blog = await this.blogRepo.findBlogById(blogId);
        if(!blog){
            return {data: null, status: httpStatus.NotFound, error: {field: 'blogId', message: 'blog not found'}};
        }
        const isChanged = await this.blogRepo.changeBlog(blog.id, input);
        if(!isChanged){
            return {data: null, status: httpStatus.NotFound, error: {field: 'blog', message: 'blog not updated'}}
        }
        return {data: null, status: httpStatus.NoContent}
    }
    async deleteSpecificBlog(blogId: string){
        const blog = await this.blogRepo.deleteSpecificBlog(blogId);
        if(!blog){
            return {data: null, status: httpStatus.NotFound, error: {field: 'blogId',  message: 'blog not found'}};
        }
        return {data: null, status: httpStatus.NoContent}
    }
}