import {TypeBlogDB, TypeBlogInput} from "../../settings/types/blog.types";
import {Blog} from "../../core/fabric/Blog.class";
import {BlogModel} from "../../settings/database/BlogModel.mongoose";
import {mapBlogToFrontView} from "../../core/mappers/blogFrontView.mapper";
import {TypePostInput, TypePostInputForBlog} from "../../settings/types/post.types";
import {PostModel} from "../../settings/database/PostModel.mongoose";
import {Post} from "../../core/fabric/Post.class";
import {mapNewPostForView} from "../../core/mappers/postFrontView.mapper";
import {WithMongoId} from "../../settings/database/db_settings";
import {injectable} from "inversify";

@injectable()
export class BlogRepo {
    async createBlog(dto: TypeBlogInput) {
        const blog = Blog.create(dto);
        const createdBlog = await BlogModel.create(blog.toDB());
        return mapBlogToFrontView(createdBlog.toObject());
    }
    async findBlogById(id:string){
        const blog = await BlogModel.findById(id).lean< WithMongoId<TypeBlogDB>>();
        if(!blog){
            return null
        }
        return mapBlogToFrontView(blog);
    }
    async createPostForSpecificBlog(blogId:string,blogName: string, dto:TypePostInputForBlog){
        const input:TypePostInput&{blogName:string} = {title: dto.title, shortDescription: dto.shortDescription, content: dto.content, blogId, blogName }
        const post = Post.create(input);
        const createdPost = await PostModel.create(post.toDB());
        return mapNewPostForView(createdPost.toObject());
    }
    async changeBlog(blogId:string, input:TypeBlogInput) {
        const result = await BlogModel.updateOne({_id:blogId},
            {$set: {name: input.name, description: input.description, websiteUrl: input.websiteUrl}});
        return result.matchedCount === 1
    }
    async deleteSpecificBlog(blogId:string){
        const blog = await BlogModel.findByIdAndDelete(blogId).lean<WithMongoId<TypeBlogDB>>()
        return blog
    }
}