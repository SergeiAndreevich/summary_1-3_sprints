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
exports.PostHandler = void 0;
const PostsService_class_1 = require("./PostsService.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const pagination_helper_1 = require("../../core/helpers/pagination.helper");
const inversify_1 = require("inversify");
let PostHandler = class PostHandler {
    constructor(postsService) {
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
};
exports.PostHandler = PostHandler;
exports.PostHandler = PostHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(PostsService_class_1.PostsService)),
    __metadata("design:paramtypes", [PostsService_class_1.PostsService])
], PostHandler);
