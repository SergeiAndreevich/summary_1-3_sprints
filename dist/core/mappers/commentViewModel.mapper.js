"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCommentToView = mapCommentToView;
const reaction_types_1 = require("../../settings/types/reaction.types");
function mapCommentToView(dto) {
    return {
        id: dto._id.toString(),
        content: dto.content,
        commentatorInfo: {
            userId: dto.commentatorInfo.userId,
            userLogin: dto.commentatorInfo.userLogin
        },
        createdAt: dto.createdAt.toISOString(),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: reaction_types_1.ReactionType.none
        }
    };
}
