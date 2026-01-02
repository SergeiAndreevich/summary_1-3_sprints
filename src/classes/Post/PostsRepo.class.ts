import {TypePostDB, TypePostInput} from "../../settings/types/post.types";
import {Post} from "../../core/fabric/Post.class";
import {BlogModel} from "../../settings/database/BlogModel.mongoose";
import {WithMongoId} from "../../settings/database/db_settings";
import {TypeBlogDB} from "../../settings/types/blog.types";
import {mapBlogToFrontView} from "../../core/mappers/blogFrontView.mapper";
import {PostModel} from "../../settings/database/PostModel.mongoose";
import {mapNewPostForView, mapPostForView} from "../../core/mappers/postFrontView.mapper";
import {EntitiesForReaction, ReactionType, TypeReactionInput} from "../../settings/types/reaction.types";
import {ReactionModel} from "../../settings/database/ReactionModel.mongoose";

export class PostsRepo {
    async createPost(dto: TypePostInput){
        const blog = await BlogModel.findById(dto.blogId).lean<WithMongoId<TypeBlogDB>>();
        if(!blog){
            return null
        }
        const input = {... dto, blogName: blog.name};
        const post = Post.create(input);
        const createdBlog = await PostModel.create(post.toDB());
        return mapNewPostForView(createdBlog.toObject());
    }

    async updatePostById(postId: string, dto:TypePostInput){
        const result = await PostModel.updateOne({_id: postId},
            {$set: dto})
        return result.matchedCount === 1
    }
    async changeReactionByPostId(postId:string, userId:string,  reaction:TypeReactionInput){
        const isUpdated = await ReactionModel.updateOne(
            {entityId:postId, entityType: EntitiesForReaction.post, userId:userId},
            {$set: {status: reaction}})
        return isUpdated.modifiedCount === 1
    }

    async findPostById(postId: string){
        const post = await PostModel.findById(postId).lean<WithMongoId<TypePostDB>>();
        if(!post){
            return null;
        }
        return mapPostForView(post)
    }
}
