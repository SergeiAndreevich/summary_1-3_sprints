import {Router} from "express";
import {CommentHandler} from "../classes/Comment/CommentHandler.class";
import {bearerGuard, optionalBearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {commentIdValidation} from "../core/middlewares/commentRouterValidators/commentId.validation";
import {idValidation} from "../core/middlewares/commentRouterValidators/id.validation";
import {commentInputValidation} from "../core/middlewares/postRouterValidators/commentInput.validation";
import {likeStatusValidation} from "../core/middlewares/postRouterValidators/likeStatus.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {container} from "../composition-root";

export const commentRouter = Router({});
const commentsHandler = container.get(CommentHandler);

commentRouter
    .put('/:commentId', bearerGuard, commentIdValidation, commentInputValidation, checkValidationErrors, commentsHandler.changeCommentByCommentId.bind(commentsHandler))
    .put('/:commentId/like-status', bearerGuard, commentIdValidation, likeStatusValidation,  checkValidationErrors, commentsHandler.changeCommentReaction.bind(commentsHandler))
    .get('/:id',optionalBearerGuard, idValidation,  checkValidationErrors, commentsHandler.findCommentById.bind(commentsHandler))
    .delete('/:commentId', bearerGuard, commentIdValidation, checkValidationErrors, commentsHandler.removeCommentByCommentId.bind(commentsHandler))