"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = setupApp;
const express_1 = __importDefault(require("express"));
const PATH_1 = require("./settings/PATH");
const auth_router_1 = require("./routers/auth.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const blog_router_1 = require("./routers/blog.router");
const post_router_1 = require("./routers/post.router");
const comment_router_1 = require("./routers/comment.router");
const user_router_1 = require("./routers/user.router");
const security_router_1 = require("./routers/security.router");
const BlogModel_mongoose_1 = require("./settings/database/BlogModel.mongoose");
const PostModel_mongoose_1 = require("./settings/database/PostModel.mongoose");
const CommentModel_mongoose_1 = require("./settings/database/CommentModel.mongoose");
const UserModel_mongoose_1 = require("./settings/database/UserModel.mongoose");
const ReactionModel_mongoose_1 = require("./settings/database/ReactionModel.mongoose");
const SessionModel_mongoose_1 = require("./settings/database/SessionModel.mongoose");
function setupApp(app) {
    app.use((0, cookie_parser_1.default)()); //middleware для чтение cookie
    app.use(express_1.default.json()); //middleware для парсинга строк. Сетевые строки в объект js
    //базовый эндпоинт, стартовая страница
    app.get('/', (req, res) => {
        res.send('Go to: ______');
    });
    app.delete('/testing/all-data', async (req, res) => {
        await BlogModel_mongoose_1.BlogModel.deleteMany({});
        await PostModel_mongoose_1.PostModel.deleteMany({});
        await CommentModel_mongoose_1.CommentModel.deleteMany({});
        await UserModel_mongoose_1.UserModel.deleteMany({});
        await ReactionModel_mongoose_1.ReactionModel.deleteMany({});
        await SessionModel_mongoose_1.SessionModel.deleteMany({});
        res.sendStatus(204);
    });
    app.use(PATH_1.PATH.auth, auth_router_1.authRouter);
    app.use(PATH_1.PATH.blogs, blog_router_1.blogRouter);
    app.use(PATH_1.PATH.posts, post_router_1.postRouter);
    app.use(PATH_1.PATH.comments, comment_router_1.commentRouter);
    app.use(PATH_1.PATH.users, user_router_1.userRouter);
    app.use(PATH_1.PATH.security, security_router_1.securityRouter);
}
