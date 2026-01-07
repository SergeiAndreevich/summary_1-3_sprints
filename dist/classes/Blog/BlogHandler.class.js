"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogHandler = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const pagination_helper_1 = require("../../core/helpers/pagination.helper");
class BlogHandler {
    constructor(queryRepo, blogService) {
        this.queryRepo = queryRepo;
        this.blogService = blogService;
    }
    async createBlog(req, res) {
        const input = req.body;
        const result = await this.blogService.createBlog(input);
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
}
exports.BlogHandler = BlogHandler;
