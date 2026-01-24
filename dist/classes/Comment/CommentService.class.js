"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const CommentRepo_class_1 = require("./CommentRepo.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const reaction_types_1 = require("../../settings/types/reaction.types");
const likeCounter_helper_1 = require("../../core/helpers/likeCounter.helper");
const ReactionsRepo_class_1 = require("../ReactionsRepo.class");
const inversify_1 = require("inversify");
let CommentService = class CommentService {
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
        const isUpdated = await this.reactionsRepo.toggleReaction(commentId, reaction_types_1.EntitiesForReaction.comment, userId, input.likeStatus);
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
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(CommentRepo_class_1.CommentRepo)),
    __param(1, (0, inversify_1.inject)(ReactionsRepo_class_1.ReactionsRepo)),
    __metadata("design:paramtypes", [CommentRepo_class_1.CommentRepo,
        ReactionsRepo_class_1.ReactionsRepo])
], CommentService);
