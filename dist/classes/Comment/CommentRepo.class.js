"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepo = void 0;
const commentViewModel_mapper_1 = require("../../core/mappers/commentViewModel.mapper");
const CommentModel_mongoose_1 = require("../../settings/database/CommentModel.mongoose");
const Comment_class_1 = require("../../core/fabric/Comment.class");
const mongodb_1 = require("mongodb");
class CommentRepo {
    async createCommentForSpecificPost(postId, dto, user) {
        const comment = Comment_class_1.Comment.create(postId, dto, user);
        const insertedComment = await CommentModel_mongoose_1.CommentModel.create(comment.toDB());
        return (0, commentViewModel_mapper_1.mapCommentToView)(insertedComment);
    }
    async findCommentsByPostId(postId, query) {
        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, searchLoginTerm, searchEmailTerm } = query;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];
        andFilters.push();
        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }
        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        if (postId) {
            andFilters.push({ postId: { $regex: postId, $options: 'i' } });
        }
        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await CommentModel_mongoose_1.CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalCount = await CommentModel_mongoose_1.CommentModel.countDocuments(filter);
        const commentsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, commentViewModel_mapper_1.mapCommentToView)(item))
        };
        return commentsToView;
    }
    async findCommentById(id) {
        const comment = await CommentModel_mongoose_1.CommentModel.findById(id).lean();
        if (!comment) {
            return null;
        }
        return (0, commentViewModel_mapper_1.mapCommentToView)(comment);
    }
    async changeCommentById(commentId, dto, userId) {
        const comment = await CommentModel_mongoose_1.CommentModel.findOne({ _id: new mongodb_1.ObjectId(commentId), "commentatorInfo.userId": userId }).lean();
        if (!comment) {
            return false;
        }
        const isUpdated = await CommentModel_mongoose_1.CommentModel.updateOne({ _id: new mongodb_1.ObjectId(commentId) }, { $set: { content: dto.content } });
        return isUpdated.modifiedCount === 1;
    }
    async removeCommentByCommentId(commentId, userId) {
        const comment = await CommentModel_mongoose_1.CommentModel.findOne({ _id: new mongodb_1.ObjectId(commentId), "commentatorInfo.userId": userId }).lean();
        if (!comment) {
            return false;
        }
        await CommentModel_mongoose_1.CommentModel.deleteOne({ _id: new mongodb_1.ObjectId(commentId) });
        return true;
    }
}
exports.CommentRepo = CommentRepo;
