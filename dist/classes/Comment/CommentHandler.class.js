"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentHandler = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
class CommentHandler {
    constructor(queryRepo, commentService) {
        this.queryRepo = queryRepo;
        this.commentService = commentService;
    }
    async changeCommentByCommentId(req, res) {
        const userId = req.userId;
        const commentId = req.params.commentId;
        const input = req.body;
        const result = await this.commentService.changeCommentByCommentId(commentId, input, userId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async changeCommentReaction(req, res) {
        const userId = req.userId;
        const commentId = req.params.commentId;
        const input = req.body;
        const result = await this.commentService.changeCommentReaction(commentId, input, userId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async findCommentById(req, res) {
        const userId = req.userId;
        const commentId = req.params.id;
        const result = await this.commentService.findCommentById(commentId, userId);
        if (result.status !== httpStatuses_1.httpStatus.Ok) {
            res.sendStatus(result.status);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Ok).send(result.data);
    }
    async removeCommentByCommentId(req, res) {
        const userId = req.userId;
        const commentId = req.params.commentId;
        const result = await this.commentService.removeCommentByCommentId(commentId, userId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
}
exports.CommentHandler = CommentHandler;
