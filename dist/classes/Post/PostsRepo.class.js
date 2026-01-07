"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsRepo = void 0;
const Post_class_1 = require("../../core/fabric/Post.class");
const BlogModel_mongoose_1 = require("../../settings/database/BlogModel.mongoose");
const PostModel_mongoose_1 = require("../../settings/database/PostModel.mongoose");
const postFrontView_mapper_1 = require("../../core/mappers/postFrontView.mapper");
class PostsRepo {
    async createPost(dto) {
        const blog = await BlogModel_mongoose_1.BlogModel.findById(dto.blogId).lean();
        if (!blog) {
            return null;
        }
        const input = { ...dto, blogName: blog.name };
        const post = Post_class_1.Post.create(input);
        const createdBlog = await PostModel_mongoose_1.PostModel.create(post.toDB());
        return (0, postFrontView_mapper_1.mapNewPostForView)(createdBlog.toObject());
    }
    async updatePostById(postId, dto) {
        const result = await PostModel_mongoose_1.PostModel.updateOne({ _id: postId }, { $set: dto });
        return result.matchedCount === 1;
    }
    async findPostById(postId) {
        const post = await PostModel_mongoose_1.PostModel.findById(postId).lean();
        if (!post) {
            return null;
        }
        return (0, postFrontView_mapper_1.mapPostForView)(post);
    }
    async findPostsByFilter(dto) {
        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, searchLoginTerm, searchEmailTerm } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];
        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }
        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await PostModel_mongoose_1.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalCount = await PostModel_mongoose_1.PostModel.countDocuments(filter);
        const postsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, postFrontView_mapper_1.mapPostForView)(item))
        };
        return postsToView;
    }
    async removePostById(postId) {
        const post = await PostModel_mongoose_1.PostModel.findByIdAndDelete(postId).lean();
        return post;
    }
}
exports.PostsRepo = PostsRepo;
