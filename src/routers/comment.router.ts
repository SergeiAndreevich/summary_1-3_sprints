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

const commentRouter = Router({});
const queryRepo = new  QueryRepo();
const commentRepo = new CommentRepo();
const commentService = new CommentService(commentRepo)
const commentsHandler = new CommentHandler(queryRepo, commentService);

commentRouter
    .put('/:commentId', bearerGuard, commentIdValidation, commentInputValidation, commentsHandler.changeCommentByCommentId)
    .put('/:commentId/like-status', bearerGuard, commentIdValidation, likeStatusValidation, commentsHandler.changeCommentReaction)
    .get('/:id',optionalBearerGuard, idValidation, commentsHandler.findCommentById)
    .delete('/:commentId', bearerGuard, commentIdValidation, commentsHandler.removeCommentByCommentId)