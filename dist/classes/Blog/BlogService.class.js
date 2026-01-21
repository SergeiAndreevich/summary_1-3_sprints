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
exports.BlogService = void 0;
const BlogRepo_class_1 = require("./BlogRepo.class");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const inversify_1 = require("inversify");
let BlogService = class BlogService {
    constructor(blogRepo) {
        this.blogRepo = blogRepo;
    }
    async createBlog(dto) {
        const blogForView = await this.blogRepo.createBlog(dto);
        if (!blogForView) {
            return { data: null, status: httpStatuses_1.httpStatus.ExtraError, error: { field: 'database', message: 'blog not created' } };
        }
        return { data: blogForView, status: httpStatuses_1.httpStatus.Created };
    }
    async createPostForSpecificBlog(blogId, input) {
        const blog = await this.blogRepo.findBlogById(blogId);
        if (!blog) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'blogId', message: 'blog not found' } };
        }
        const createdPost = await this.blogRepo.createPostForSpecificBlog(blog.id, blog.name, input);
        return { data: createdPost, status: httpStatuses_1.httpStatus.Created };
    }
    async changeBlog(blogId, input) {
        const blog = await this.blogRepo.findBlogById(blogId);
        if (!blog) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'blogId', message: 'blog not found' } };
        }
        const isChanged = await this.blogRepo.changeBlog(blog.id, input);
        if (!isChanged) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'blog', message: 'blog not updated' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async deleteSpecificBlog(blogId) {
        const blog = await this.blogRepo.deleteSpecificBlog(blogId);
        if (!blog) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'blogId', message: 'blog not found' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(BlogRepo_class_1.BlogRepo)),
    __metadata("design:paramtypes", [BlogRepo_class_1.BlogRepo])
], BlogService);
