import express, {Express, Request, Response, NextFunction} from 'express';
import {PATH} from "./settings/PATH";
import {authRouter} from "./routers/auth.router";
import cookieParser from "cookie-parser";
import {blogRouter} from "./routers/blog.router";
import {postRouter} from "./routers/post.router";
import {commentRouter} from "./routers/comment.router";
import {userRouter} from "./routers/user.router";
import {securityRouter} from "./routers/security.router";
import {BlogModel} from "./settings/database/BlogModel.mongoose";
import {PostModel} from "./settings/database/PostModel.mongoose";
import {CommentModel} from "./settings/database/CommentModel.mongoose";
import {UserModel} from "./settings/database/UserModel.mongoose";
import {ReactionModel} from "./settings/database/ReactionModel.mongoose";
import {SessionModel} from "./settings/database/SessionModel.mongoose";

export function setupApp(app: Express) {
    app.use(cookieParser());  //middleware для чтение cookie
    app.use(express.json());  //middleware для парсинга строк. Сетевые строки в объект js

    //базовый эндпоинт, стартовая страница
    app.get('/', (req, res) => {
        res.send('Go to: ______');
    })
    app.delete('/testing/all-data', async (req: Request, res: Response) => {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await CommentModel.deleteMany({});
        await UserModel.deleteMany({});
        await ReactionModel.deleteMany({});
        await SessionModel.deleteMany({});

        res.sendStatus(204);
    });
    app.use(PATH.auth, authRouter);
    app.use(PATH.blogs, blogRouter);
    app.use(PATH.posts, postRouter);
    app.use(PATH.comments, commentRouter);
    app.use(PATH.users, userRouter);
    app.use(PATH.security, securityRouter);


}