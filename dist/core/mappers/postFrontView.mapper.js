"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapNewPostForView = mapNewPostForView;
exports.mapPostForView = mapPostForView;
const reaction_types_1 = require("../../settings/types/reaction.types");
function mapNewPostForView(dto) {
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
            myStatus: reaction_types_1.ReactionType.none,
            newestLikes: []
        }
    };
}
function mapPostForView(dto) {
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
            myStatus: reaction_types_1.ReactionType.none,
            newestLikes: []
        }
    };
}
