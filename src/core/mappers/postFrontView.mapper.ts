import {TypePostDB, TypePostView} from "../../settings/types/post.types";
import {WithMongoId} from "../../settings/database/db_settings";
import {ReactionType} from "../../settings/types/reaction.types";

export function mapNewPostForView(dto: WithMongoId<TypePostDB>): TypePostView {
    return {
        id: dto._id.toString(),
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId,
        blogName: dto.blogName,
        createdAt: dto.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: ReactionType.none,
            newestLikes: []
        }
    }
}

export function mapPostForView(dto: WithMongoId<TypePostDB>): TypePostView {
    return {
        id: dto._id.toString(),
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId,
        blogName: dto.blogName,
        createdAt: dto.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: ReactionType.none,
            newestLikes: []
        }
    }
}