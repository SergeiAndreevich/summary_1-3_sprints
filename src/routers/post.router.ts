import {Router} from "express";
import {basicGuard} from "../core/middlewares/guard/basicAuthorization";
import {PostHandler} from "../classes/Post/PostsHandler.class";
import {bearerGuard, optionalBearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {postIdValidation} from "../core/middlewares/postRouterValidators/postId.validation";
import {idValidation} from "../core/middlewares/postRouterValidators/id.validation";
import {postInputValidation} from "../core/middlewares/postRouterValidators/postInput.validation";
import {commentInputValidation} from "../core/middlewares/postRouterValidators/commentInput.validation";
import {likeStatusValidation} from "../core/middlewares/postRouterValidators/likeStatus.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {container} from "../composition-root";


export const postRouter = Router({});
const postHandler = container.get(PostHandler);

postRouter
    .post('/', basicGuard, postInputValidation, postHandler.createPost)
    .post('/:postId/comments', bearerGuard, postIdValidation, commentInputValidation,  checkValidationErrors, postHandler.createCommentForSpecificPostId)
    .put('/:id', basicGuard, idValidation, postInputValidation,  checkValidationErrors, postHandler.updatePostById)
    .put('/:postId/like-status', bearerGuard, postIdValidation, likeStatusValidation,  checkValidationErrors, postHandler.changeReactionByPostId)
    .get('/:id', optionalBearerGuard, idValidation,  checkValidationErrors, postHandler.findPostById)
    .get('/:postId/comments', optionalBearerGuard, postIdValidation,  checkValidationErrors, postHandler.findCommentsByPostId)
    .get('/', optionalBearerGuard, postHandler.findPostsByFilter)
    .delete('/:id', idValidation, checkValidationErrors, postHandler.removePostById)