import {Router} from "express";
import {basicGuard} from "../core/middlewares/guard/basicAuthorization";
import {QueryRepo} from "../classes/QueryRepo.class";
import {PostHandler} from "../classes/Post/PostsHandler.class";
import {PostsRepo} from "../classes/Post/PostsRepo.class";
import {PostsService} from "../classes/Post/PostsService.class";
import {bearerGuard, optionalBearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {postIdValidation} from "../core/middlewares/postRouterValidators/postId.validation";
import {CommentRepo} from "../classes/Comment/CommentRepo.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {idValidation} from "../core/middlewares/postRouterValidators/id.validation";
import {postInputValidation} from "../core/middlewares/postRouterValidators/postInput.validation";
import {commentInputValidation} from "../core/middlewares/postRouterValidators/commentInput.validation";
import {likeStatusValidation} from "../core/middlewares/postRouterValidators/likeStatus.validation";
import {ReactionsRepo} from "../classes/ReactionsRepo.class";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";


export const postRouter = Router({});
const queryRepo = new QueryRepo();
const postsRepo = new PostsRepo();
const commentRepo = new CommentRepo();
const usersRepo = new UsersRepo();
const reactionsRepo = new ReactionsRepo();
const postsService = new PostsService(postsRepo,usersRepo,commentRepo, reactionsRepo);
const postHandler = new PostHandler(queryRepo, postsService);

postRouter
    .post('/', basicGuard, postInputValidation, postHandler.createPost)
    .post('/:postId/comments', bearerGuard, postIdValidation, commentInputValidation,  checkValidationErrors, postHandler.createCommentForSpecificPostId)
    .put('/:id', basicGuard, idValidation, postInputValidation,  checkValidationErrors, postHandler.updatePostById)
    .put('/:postId/like-status', bearerGuard, postIdValidation, likeStatusValidation,  checkValidationErrors, postHandler.changeReactionByPostId)
    .get('/:id', optionalBearerGuard, idValidation,  checkValidationErrors, postHandler.findPostById)
    .get('/:postId/comments', optionalBearerGuard, postIdValidation,  checkValidationErrors, postHandler.findCommentsByPostId)
    .get('/', optionalBearerGuard, postHandler.findPostsByFilter)
    .delete('/:id', idValidation, checkValidationErrors, postHandler.removePostById)