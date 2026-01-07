"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CommentHandler_class_1 = require("../classes/Comment/CommentHandler.class");
const QueryRepo_class_1 = require("../classes/QueryRepo.class");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const commentId_validation_1 = require("../core/middlewares/commentRouterValidators/commentId.validation");
const CommentService_class_1 = require("../classes/Comment/CommentService.class");
const CommentRepo_class_1 = require("../classes/Comment/CommentRepo.class");
const id_validation_1 = require("../core/middlewares/commentRouterValidators/id.validation");
const commentInput_validation_1 = require("../core/middlewares/postRouterValidators/commentInput.validation");
const likeStatus_validation_1 = require("../core/middlewares/postRouterValidators/likeStatus.validation");
const ReactionsRepo_class_1 = require("../classes/ReactionsRepo.class");
const commentRouter = (0, express_1.Router)({});
const queryRepo = new QueryRepo_class_1.QueryRepo();
const commentRepo = new CommentRepo_class_1.CommentRepo();
const reactionsRepo = new ReactionsRepo_class_1.ReactionsRepo();
const commentService = new CommentService_class_1.CommentService(commentRepo, reactionsRepo);
const commentsHandler = new CommentHandler_class_1.CommentHandler(queryRepo, commentService);
commentRouter
    .put('/:commentId', bearerAuthorization_1.bearerGuard, commentId_validation_1.commentIdValidation, commentInput_validation_1.commentInputValidation, commentsHandler.changeCommentByCommentId)
    .put('/:commentId/like-status', bearerAuthorization_1.bearerGuard, commentId_validation_1.commentIdValidation, likeStatus_validation_1.likeStatusValidation, commentsHandler.changeCommentReaction)
    .get('/:id', bearerAuthorization_1.optionalBearerGuard, id_validation_1.idValidation, commentsHandler.findCommentById)
    .delete('/:commentId', bearerAuthorization_1.bearerGuard, commentId_validation_1.commentIdValidation, commentsHandler.removeCommentByCommentId);
