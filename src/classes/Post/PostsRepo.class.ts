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
import {IPAginationAndSorting} from "../../settings/types/pagination.types";

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
    async findPostsByFilter(dto:IPAginationAndSorting){
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchLoginTerm,
            searchEmailTerm
        } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];

        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }

        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean< WithMongoId<TypePostDB>[]>();
        const totalCount = await PostModel.countDocuments(filter);
        const postsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => mapPostForView(item))
        }
        return postsToView
    }

    async removePostById(postId: string){
        const post = await PostModel.findByIdAndDelete(postId).lean<WithMongoId<TypePostDB>>();
        return post
    }
}
