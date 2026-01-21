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
    .post('/', basicGuard, postInputValidation, postHandler.createPost.bind(postHandler))
    .post('/:postId/comments', bearerGuard, postIdValidation, commentInputValidation,  checkValidationErrors, postHandler.createCommentForSpecificPostId.bind(postHandler))
    .put('/:id', basicGuard, idValidation, postInputValidation,  checkValidationErrors, postHandler.updatePostById.bind(postHandler))
    .put('/:postId/like-status', bearerGuard, postIdValidation, likeStatusValidation,  checkValidationErrors, postHandler.changeReactionByPostId.bind(postHandler))
    .get('/:id', optionalBearerGuard, idValidation,  checkValidationErrors, postHandler.findPostById.bind(postHandler))
    .get('/:postId/comments', optionalBearerGuard, postIdValidation,  checkValidationErrors, postHandler.findCommentsByPostId.bind(postHandler))
    .get('/', optionalBearerGuard, postHandler.findPostsByFilter.bind(postHandler))
    .delete('/:id', idValidation, checkValidationErrors, postHandler.removePostById.bind(postHandler))