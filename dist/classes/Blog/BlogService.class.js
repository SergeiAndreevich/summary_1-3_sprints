"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
class BlogService {
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
}
exports.BlogService = BlogService;
