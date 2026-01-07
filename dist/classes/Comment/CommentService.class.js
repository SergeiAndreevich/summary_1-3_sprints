"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const reaction_types_1 = require("../../settings/types/reaction.types");
const likeCounter_helper_1 = require("../../core/helpers/likeCounter.helper");
class CommentService {
    constructor(commentRepo, reactionsRepo) {
        this.commentRepo = commentRepo;
        this.reactionsRepo = reactionsRepo;
    }
    async changeCommentByCommentId(commentId, input, userId) {
        const comment = await this.commentRepo.findCommentById(commentId);
        if (!comment) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'commentId', message: 'Comment not found' } };
        }
        const isUpdated = await this.commentRepo.changeCommentById(commentId, input, userId);
        if (!isUpdated) {
            return { data: null, status: httpStatuses_1.httpStatus.Forbidden, error: { field: 'userId', message: 'Not your comment' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async changeCommentReaction(commentId, input, userId) {
        const comment = await this.commentRepo.findCommentById(commentId);
        if (!comment) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'commentId', message: 'Comment not found' } };
        }
        const isUpdated = await this.reactionsRepo.toggleReaction(commentId, reaction_types_1.EntitiesForReaction.comment, userId, input.LikeStatus);
        if (isUpdated === false) {
            return {
                data: null,
                status: httpStatuses_1.httpStatus.ExtraError,
                error: { field: 'reaction', message: 'Reaction not changed' }
            };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async findCommentById(commentId, userId) {
        const comment = await this.commentRepo.findCommentById(commentId);
        if (!comment) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'commentId', message: 'Comment not found' } };
        }
        const { reactionMap, myStatusMap } = await likeCounter_helper_1.likesCounterHelper.getLikesForEntity(reaction_types_1.EntitiesForReaction.comment, [commentId], userId);
        const commentToView = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: reactionMap[commentId]?.likes ?? 0,
                dislikesCount: reactionMap[commentId]?.dislikes ?? 0,
                myStatus: myStatusMap[commentId] ?? reaction_types_1.ReactionType.none
            }
        };
        return { data: commentToView, status: httpStatuses_1.httpStatus.Ok };
    }
    async removeCommentByCommentId(commentId, userId) {
        const comment = await this.commentRepo.findCommentById(commentId);
        if (!comment) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'commentId', message: 'Comment not found' } };
        }
        const isDeleted = await this.commentRepo.removeCommentByCommentId(commentId, userId);
        if (!isDeleted) {
            return { data: null, status: httpStatuses_1.httpStatus.Forbidden, error: { field: 'commentId', message: 'Not your comment' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
}
exports.CommentService = CommentService;
