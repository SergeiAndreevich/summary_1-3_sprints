"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRepo = void 0;
const UserModel_mongoose_1 = require("../settings/database/UserModel.mongoose");
const userViewModel_mapper_1 = require("../core/mappers/userViewModel.mapper");
const BlogModel_mongoose_1 = require("../settings/database/BlogModel.mongoose");
const blogFrontView_mapper_1 = require("../core/mappers/blogFrontView.mapper");
const PostModel_mongoose_1 = require("../settings/database/PostModel.mongoose");
const likeCounter_helper_1 = require("../core/helpers/likeCounter.helper");
const reaction_types_1 = require("../settings/types/reaction.types");
const SessionModel_mongoose_1 = require("../settings/database/SessionModel.mongoose");
const mapSessionToView_mapper_1 = require("../core/mappers/mapSessionToView.mapper");
class QueryRepo {
    async findUserByLoginOrEmail(login, email) {
        const user = await UserModel_mongoose_1.UserModel.findOne({ $or: [
                { 'accountData.login': login },
                { 'accountData.email': email }
            ] }).lean();
        if (!user) {
            return null;
        }
        return (0, userViewModel_mapper_1.mapUserToView)(user);
    }
    async findUsersByFilter(dto) {
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
        const items = await UserModel_mongoose_1.UserModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalCount = await UserModel_mongoose_1.UserModel.countDocuments(filter);
        const usersToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, userViewModel_mapper_1.mapUserToView)(item))
        };
        return usersToView;
    }
    async findUserById(userId) {
        const user = await UserModel_mongoose_1.UserModel.findById(userId).lean();
        if (!user) {
            return null;
        }
        return (0, userViewModel_mapper_1.mapUserToView)(user);
    }
    async findSpecificBlog(blogId) {
        const blog = await BlogModel_mongoose_1.BlogModel.findById(blogId).lean();
        if (!blog) {
            return null;
        }
        return (0, blogFrontView_mapper_1.mapBlogToFrontView)(blog);
    }
    async findPostsForSpecificBlog(blogId, dto, userId) {
        const blog = await BlogModel_mongoose_1.BlogModel.findById(blogId).lean();
        if (!blog) {
            return null;
        }
        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm, searchLoginTerm, searchEmailTerm } = dto;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];
        andFilters.push({ blogId: blogId });
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
        const items = await PostModel_mongoose_1.PostModel.find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalCount = await PostModel_mongoose_1.PostModel.countDocuments(filter);
        //теперь пошло новенькое: агрегация лайков
        const postIds = items.map(p => p._id.toString());
        //ищем все записи в коллекции реакций по всем пост-id для нашего блога
        const { reactionMap, myStatusMap } = await likeCounter_helper_1.likesCounterHelper.getLikesForEntity(reaction_types_1.EntitiesForReaction.post, postIds, userId);
        const enrichedData = items.map(p => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt.toISOString(),
            extendedLikesInfo: {
                likesCount: reactionMap[p._id.toString()].likes ?? 0,
                dislikesCount: reactionMap[p._id.toString()].dislikes ?? 0,
                myStatus: userId ? myStatusMap[p._id.toString()] ?? reaction_types_1.ReactionType.none : reaction_types_1.ReactionType.none,
                newestLikes: reactionMap[p._id.toString()].newestLikes ?? []
            }
        }));
        const postsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: enrichedData
        };
        return postsToView;
    }
    async findBlogsByFilter(dto) {
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
        const items = await BlogModel_mongoose_1.BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean();
        const totalCount = await BlogModel_mongoose_1.BlogModel.countDocuments(filter);
        const blogsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => (0, blogFrontView_mapper_1.mapBlogToFrontView)(item))
        };
        return blogsToView;
    }
    async findSessionByDeviceId(deviceId) {
        const session = await SessionModel_mongoose_1.SessionModel.findOne({ deviceId: deviceId }).lean();
        if (!session) {
            return null;
        }
        return (0, mapSessionToView_mapper_1.mapSessionToView)(session);
    }
}
exports.QueryRepo = QueryRepo;
