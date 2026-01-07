"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepo = void 0;
const Blog_class_1 = require("../../core/fabric/Blog.class");
const BlogModel_mongoose_1 = require("../../settings/database/BlogModel.mongoose");
const blogFrontView_mapper_1 = require("../../core/mappers/blogFrontView.mapper");
const PostModel_mongoose_1 = require("../../settings/database/PostModel.mongoose");
const Post_class_1 = require("../../core/fabric/Post.class");
const postFrontView_mapper_1 = require("../../core/mappers/postFrontView.mapper");
class BlogRepo {
    async createBlog(dto) {
        const blog = Blog_class_1.Blog.create(dto);
        const createdBlog = await BlogModel_mongoose_1.BlogModel.create(blog.toDB());
        return (0, blogFrontView_mapper_1.mapBlogToFrontView)(createdBlog.toObject());
    }
    async findBlogById(id) {
        const blog = await BlogModel_mongoose_1.BlogModel.findById(id).lean();
        if (!blog) {
            return null;
        }
        return (0, blogFrontView_mapper_1.mapBlogToFrontView)(blog);
    }
    async createPostForSpecificBlog(blogId, blogName, dto) {
        const input = { title: dto.title, shortDescription: dto.shortDescription, content: dto.content, blogId, blogName };
        const post = Post_class_1.Post.create(input);
        const createdPost = await PostModel_mongoose_1.PostModel.create(post.toDB());
        return (0, postFrontView_mapper_1.mapNewPostForView)(createdPost.toObject());
    }
    async changeBlog(blogId, input) {
        const result = await BlogModel_mongoose_1.BlogModel.updateOne({ _id: blogId }, { $set: { name: input.name, description: input.description, websiteUrl: input.websiteUrl } });
        return result.matchedCount === 1;
    }
    async deleteSpecificBlog(blogId) {
        const blog = await BlogModel_mongoose_1.BlogModel.findByIdAndDelete(blogId).lean();
        return blog;
    }
}
exports.BlogRepo = BlogRepo;
