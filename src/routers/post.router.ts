import {Router} from "express";
import {basicGuard} from "../core/middlewares/guard/basicAuthorization";
import {QueryRepo} from "../classes/QueryRepo.class";
import {PostHandler} from "../classes/Post/PostsHandler.class";
import {PostsRepo} from "../classes/Post/PostsRepo.class";
import {PostsService} from "../classes/Post/PostsService.class";
import {bearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {postIdValidation} from "../core/middlewares/postRouterValidators/postId.validation";
import {CommentService} from "../classes/Comment/CommentService.class";
import {CommentRepo} from "../classes/Comment/CommentRepo.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {idValidation} from "../core/middlewares/postRouterValidators/id.validation";


const postRouter = Router({});
const queryRepo = new QueryRepo();
const postsRepo = new PostsRepo();
const commentRepo = new CommentRepo();
const usersRepo = new UsersRepo();
const postsService = new PostsService(postsRepo,usersRepo,commentRepo);
const postHandler = new PostHandler(queryRepo, postsService);

postRouter
    .post('/', basicGuard, postHandler.createPost)
    .post('/:postId/comments', bearerGuard, postIdValidation, postHandler.createCommentForSpecificPostId)
    .put('/:id', basicGuard, idValidation, postHandler.updatePostById)
    .put('/:postId/like-status', bearerGuard, postIdValidation, postHandler.changeReactionByPostId)
    .get('/:id', idValidation, postHandler.findPostById)