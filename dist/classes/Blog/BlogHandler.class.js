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
exports.BlogHandler = void 0;
const QueryRepo_class_1 = require("../QueryRepo.class");
const BlogService_class_1 = require("./BlogService.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const pagination_helper_1 = require("../../core/helpers/pagination.helper");
const inversify_1 = require("inversify");
let BlogHandler = class BlogHandler {
    constructor(queryRepo, blogService) {
        this.queryRepo = queryRepo;
        this.blogService = blogService;
    }
    async createBlog(req, res) {
        const input = req.body;
        const result = await this.blogService.createBlog(input);
        if (result.status !== httpStatuses_1.httpStatus.Created) {
            res.sendStatus(result.status);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Created).send(result.data);
    }
    async createPostForSpecificBlog(req, res) {
        const blogId = req.params.blogId;
        const input = req.body;
        const result = await this.blogService.createPostForSpecificBlog(blogId, input);
        if (result.status !== httpStatuses_1.httpStatus.Created) {
            res.sendStatus(result.status);
            return;
        }
        res.status(result.status).send(result.data);
    }
    async changeBlogById(req, res) {
        const blogId = req.params.id;
        const input = req.body;
        const result = await this.blogService.changeBlog(blogId, input);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(result.status);
    }
    async findSpecificBlogById(req, res) {
        const blogId = req.params.id;
        const blog = await this.queryRepo.findSpecificBlog(blogId);
        if (!blog) {
            res.sendStatus(httpStatuses_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Ok).send(blog);
    }
    async findPostsForSpecificBlogId(req, res) {
        const blogId = req.params.blogId;
        const query = req.query;
        const filter = (0, pagination_helper_1.paginationHelper)(query);
        const postList = await this.queryRepo.findPostsForSpecificBlog(blogId, filter);
        if (!postList) {
            res.sendStatus(httpStatuses_1.httpStatus.NotFound);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Ok).send(postList);
    }
    async findBlogsByFilter(req, res) {
        const query = req.query;
        const filter = (0, pagination_helper_1.paginationHelper)(query);
        const blogsList = await this.queryRepo.findBlogsByFilter(filter);
        res.status(httpStatuses_1.httpStatus.Ok).send(blogsList);
    }
    async deleteSpecificBlog(req, res) {
        const blogId = req.params.id;
        const result = await this.blogService.deleteSpecificBlog(blogId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
};
exports.BlogHandler = BlogHandler;
exports.BlogHandler = BlogHandler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(QueryRepo_class_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(BlogService_class_1.BlogService)),
    __metadata("design:paramtypes", [QueryRepo_class_1.QueryRepo,
        BlogService_class_1.BlogService])
], BlogHandler);
