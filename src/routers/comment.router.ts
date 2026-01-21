import {Router} from "express";
import {CommentHandler} from "../classes/Comment/CommentHandler.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {bearerGuard, optionalBearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {commentIdValidation} from "../core/middlewares/commentRouterValidators/commentId.validation";
import {CommentService} from "../classes/Comment/CommentService.class";
import {CommentRepo} from "../classes/Comment/CommentRepo.class";
import {idValidation} from "../core/middlewares/commentRouterValidators/id.validation";
import {commentInputValidation} from "../core/middlewares/postRouterValidators/commentInput.validation";
import {likeStatusValidation} from "../core/middlewares/postRouterValidators/likeStatus.validation";
import {ReactionsRepo} from "../classes/ReactionsRepo.class";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {container} from "../composition-root";

export const commentRouter = Router({});
const commentsHandler = container.get(CommentHandler);

commentRouter
    .put('/:commentId', bearerGuard, commentIdValidation, commentInputValidation, checkValidationErrors, commentsHandler.changeCommentByCommentId)
    .put('/:commentId/like-status', bearerGuard, commentIdValidation, likeStatusValidation,  checkValidationErrors, commentsHandler.changeCommentReaction)
    .get('/:id',optionalBearerGuard, idValidation,  checkValidationErrors, commentsHandler.findCommentById)
    .delete('/:commentId', bearerGuard, commentIdValidation, checkValidationErrors, commentsHandler.removeCommentByCommentId)