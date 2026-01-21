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
exports.CommentHandler = void 0;
const CommentService_class_1 = require("./CommentService.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const inversify_1 = require("inversify");
let CommentHandler = class CommentHandler {
    constructor(commentService) {
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
};
exports.CommentHandler = CommentHandler;
exports.CommentHandler = CommentHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(CommentService_class_1.CommentService)),
    __metadata("design:paramtypes", [CommentService_class_1.CommentService])
], CommentHandler);
