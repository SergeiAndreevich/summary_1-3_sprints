"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const reaction_types_1 = require("../../settings/types/reaction.types");
const likeCounter_helper_1 = require("../../core/helpers/likeCounter.helper");
class PostsService {
    constructor(postsRepo, usersRepo, commentRepo, reactionsRepo) {
        this.postsRepo = postsRepo;
        this.usersRepo = usersRepo;
        this.commentRepo = commentRepo;
        this.reactionsRepo = reactionsRepo;
    }
    async createPost(input) {
        const post = await this.postsRepo.createPost(input);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.ExtraError };
        }
        return { data: post, status: httpStatuses_1.httpStatus.Created };
    }
    async createCommentForSpecificPost(postId, input, userId) {
        const post = await this.postsRepo.findPostById(postId);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'postId', message: 'Post not found' } };
        }
        const commentator = await this.usersRepo.findUserById(userId);
        if (!commentator) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'userId', message: 'User not found' } };
        }
        const commentatorInfo = { userId, userLogin: commentator.accountData.login };
        const comment = await this.commentRepo.createCommentForSpecificPost(postId, input, commentatorInfo);
        return { data: comment, status: httpStatuses_1.httpStatus.Created };
    }
    async updatePostById(postId, input) {
        const post = await this.postsRepo.findPostById(postId);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'postId', message: 'Post not found' } };
        }
        const isUpdated = await this.postsRepo.updatePostById(postId, input);
        if (!isUpdated) {
            return { data: null, status: httpStatuses_1.httpStatus.ExtraError, error: { field: 'database', message: 'Post not updated' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async changeReactionByPostId(postId, userId, input) {
        const post = await this.postsRepo.findPostById(postId);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'postId', message: 'Post not found' } };
        }
        const result = await this.reactionsRepo.toggleReaction(postId, reaction_types_1.EntitiesForReaction.post, userId, input.LikeStatus);
        if (!result) {
            return { data: null, status: httpStatuses_1.httpStatus.ExtraError, error: { field: 'database', message: 'Reaction not updated' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async findPostById(postId, userId) {
        const post = await this.postsRepo.findPostById(postId);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'postId', message: 'Post not found' } };
        }
        const { reactionMap, myStatusMap } = await likeCounter_helper_1.likesCounterHelper.getLikesForEntity(reaction_types_1.EntitiesForReaction.post, [postId], userId);
        const resultPost = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: reactionMap[postId]?.likes ?? 0,
                dislikesCount: reactionMap[postId]?.dislikes ?? 0,
                myStatus: userId
                    ? myStatusMap[postId] ?? reaction_types_1.ReactionType.none
                    : reaction_types_1.ReactionType.none,
                newestLikes: reactionMap[postId]?.newestLikes ?? []
            }
        };
        return { data: resultPost, status: httpStatuses_1.httpStatus.Ok };
    }
    async findCommentsByPostId(postId, filter, userId) {
        const post = await this.postsRepo.findPostById(postId);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'postId', message: 'Post not found' } };
        }
        const commentsList = await this.commentRepo.findCommentsByPostId(postId, filter);
        const commentIds = commentsList.items.map(c => c.id);
        const { reactionMap, myStatusMap } = await likeCounter_helper_1.likesCounterHelper.getLikesForEntity(reaction_types_1.EntitiesForReaction.comment, commentIds, userId);
        const itemsWithReaction = commentsList.items.map(i => {
            return {
                id: i.id,
                content: i.content,
                commentatorInfo: i.commentatorInfo,
                createdAt: i.createdAt,
                likesInfo: {
                    likesCount: reactionMap[i.id]?.likes ?? 0,
                    dislikesCount: reactionMap[i.id]?.dislikes ?? 0,
                    myStatus: myStatusMap[i.id] ?? reaction_types_1.ReactionType.none
                }
            };
        });
        const commentsListToView = {
            pagesCount: commentsList.pagesCount,
            page: commentsList.page,
            pageSize: commentsList.pageSize,
            totalCount: commentsList.totalCount,
            items: itemsWithReaction
        };
        return { data: commentsListToView, status: httpStatuses_1.httpStatus.Ok };
    }
    async findPostsByFilter(filter, userId) {
        const postsList = await this.postsRepo.findPostsByFilter(filter);
        const postIds = postsList.items.map(p => p.id);
        const { reactionMap, myStatusMap } = await likeCounter_helper_1.likesCounterHelper.getLikesForEntity(reaction_types_1.EntitiesForReaction.post, postIds, userId);
        const itemsWithReaction = postsList.items.map(i => {
            return {
                id: i.id,
                title: i.title,
                shortDescription: i.shortDescription,
                content: i.content,
                blogId: i.blogId,
                blogName: i.blogName,
                createdAt: i.createdAt,
                extendedLikesInfo: {
                    likesCount: reactionMap[i.id]?.likes ?? 0,
                    dislikesCount: reactionMap[i.id]?.dislikes ?? 0,
                    myStatus: myStatusMap[i.id] ?? reaction_types_1.ReactionType.none,
                    newestLikes: reactionMap[i.id]?.newestLikes ?? []
                }
            };
        });
        const postsListToView = {
            pagesCount: postsList.pagesCount,
            page: postsList.page,
            pageSize: postsList.pageSize,
            totalCount: postsList.totalCount,
            items: itemsWithReaction
        };
        return { data: postsListToView, status: httpStatuses_1.httpStatus.Ok };
    }
    async removePostById(postId) {
        const post = await this.postsRepo.removePostById(postId);
        if (!post) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'postId', message: 'Post not found' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
}
exports.PostsService = PostsService;
