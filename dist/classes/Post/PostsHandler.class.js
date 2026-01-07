"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHandler = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const pagination_helper_1 = require("../../core/helpers/pagination.helper");
class PostHandler {
    constructor(queryRepo, postsService) {
        this.queryRepo = queryRepo;
        this.postsService = postsService;
    }
    async createPost(req, res) {
        const input = req.body;
        const result = await this.postsService.createPost(input);
        if (result.status !== httpStatuses_1.httpStatus.Created) {
            res.sendStatus(httpStatuses_1.httpStatus.ExtraError);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Created).send(result.data);
    }
    async createCommentForSpecificPostId(req, res) {
        const postId = req.params.postId;
        const input = req.body;
        const userId = req.userId;
        const result = await this.postsService.createCommentForSpecificPost(postId, input, userId);
        if (result.status !== httpStatuses_1.httpStatus.Created) {
            res.sendStatus(result.status);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Created).send(result.data);
    }
    async updatePostById(req, res) {
        const postId = req.params.id;
        const input = req.body;
        const result = await this.postsService.updatePostById(postId, input);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.status(httpStatuses_1.httpStatus.NoContent);
    }
    async changeReactionByPostId(req, res) {
        const postId = req.params.postId;
        const userId = req.userId;
        const input = req.body;
        const result = await this.postsService.changeReactionByPostId(postId, userId, input);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async findPostById(req, res) {
        const postId = req.params.id;
        const userId = req.userId;
        const result = await this.postsService.findPostById(postId, userId);
        if (result.status !== httpStatuses_1.httpStatus.Ok) {
            res.sendStatus(result.status);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Ok).send(result.data);
    }
    async findCommentsByPostId(req, res) {
        const postId = req.params.postId;
        const userId = req.userId;
        const query = req.query;
        const filter = (0, pagination_helper_1.paginationHelper)(query);
        const result = await this.postsService.findCommentsByPostId(postId, filter, userId);
        if (result.status !== httpStatuses_1.httpStatus.Ok) {
            res.sendStatus(result.status);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Ok).send(result.data);
    }
    async findPostsByFilter(req, res) {
        const query = req.query;
        const filter = (0, pagination_helper_1.paginationHelper)(query);
        const userId = req.userId;
        const result = await this.postsService.findPostsByFilter(filter, userId);
        res.status(httpStatuses_1.httpStatus.Ok).send(result.data);
    }
    async removePostById(req, res) {
        const postId = req.params.id;
        const result = await this.postsService.removePostById(postId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
}
exports.PostHandler = PostHandler;
