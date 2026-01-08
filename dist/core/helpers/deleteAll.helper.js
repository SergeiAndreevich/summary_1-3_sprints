"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = deleteAll;
const BlogModel_mongoose_1 = require("../../settings/database/BlogModel.mongoose");
const PostModel_mongoose_1 = require("../../settings/database/PostModel.mongoose");
const CommentModel_mongoose_1 = require("../../settings/database/CommentModel.mongoose");
const UserModel_mongoose_1 = require("../../settings/database/UserModel.mongoose");
const ReactionModel_mongoose_1 = require("../../settings/database/ReactionModel.mongoose");
const SessionModel_mongoose_1 = require("../../settings/database/SessionModel.mongoose");
async function deleteAll(req, res, next) {
    await BlogModel_mongoose_1.BlogModel.deleteMany();
    await PostModel_mongoose_1.PostModel.deleteMany();
    await CommentModel_mongoose_1.CommentModel.deleteMany();
    await UserModel_mongoose_1.UserModel.deleteMany();
    await ReactionModel_mongoose_1.ReactionModel.deleteMany();
    await SessionModel_mongoose_1.SessionModel.deleteMany();
    next();
}
