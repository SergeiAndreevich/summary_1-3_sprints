import "reflect-metadata";
import {Container} from "inversify";
import {QueryRepo} from "./classes/QueryRepo.class";
import {BlogRepo} from "./classes/Blog/BlogRepo.class";
import {PostsRepo} from "./classes/Post/PostsRepo.class";
import {CommentRepo} from "./classes/Comment/CommentRepo.class";
import {UsersRepo} from "./classes/Users/UsersRepo.class";
import {SessionsRepo} from "./classes/Session/SessionsRepo.class";
import {BlogService} from "./classes/Blog/BlogService.class";
import {PostsService} from "./classes/Post/PostsService.class";
import {CommentService} from "./classes/Comment/CommentService.class";
import {UsersService} from "./classes/Users/UsersService.class";
import {SessionsService} from "./classes/Session/SessionsService.class";
import {BlogHandler} from "./classes/Blog/BlogHandler.class";
import {PostHandler} from "./classes/Post/PostsHandler.class";
import {CommentHandler} from "./classes/Comment/CommentHandler.class";
import {UserHandler} from "./classes/Users/UsersHandler.class";
import {SessionsHandler} from "./classes/Session/SessionsHandler.class";
import {Auth} from "./classes/Auth/AuthHandler.class";
import {AuthRepo} from "./classes/Auth/AuthRepo.class";
import {AuthService} from "./classes/Auth/AuthService.class";
import {ReactionsRepo} from "./classes/ReactionsRepo.class";

export const container =  new Container();

container.bind(QueryRepo).to(QueryRepo);
container.bind(BlogRepo).to(BlogRepo);
container.bind(PostsRepo).to(PostsRepo);
container.bind(CommentRepo).to(CommentRepo);
container.bind(UsersRepo).to(UsersRepo);
container.bind(SessionsRepo).to(SessionsRepo);
container.bind(AuthRepo).to(AuthRepo);
container.bind(ReactionsRepo).to(ReactionsRepo);

container.bind(BlogService).to(BlogService);
container.bind(PostsService).to(PostsService);
container.bind(CommentService).to(CommentService);
container.bind(UsersService).to(UsersService);
container.bind(SessionsService).to(SessionsService);
container.bind(AuthService).to(AuthService);

container.bind(BlogHandler).to(BlogHandler);
container.bind(PostHandler).to(PostHandler);
container.bind(CommentHandler).to(CommentHandler);
container.bind(UserHandler).to(UserHandler);
container.bind(SessionsHandler).to(SessionsHandler);
container.bind(Auth).to(Auth);
