"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const CommentHandler_class_1 = require("../classes/Comment/CommentHandler.class");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const commentId_validation_1 = require("../core/middlewares/commentRouterValidators/commentId.validation");
const id_validation_1 = require("../core/middlewares/commentRouterValidators/id.validation");
const commentInput_validation_1 = require("../core/middlewares/postRouterValidators/commentInput.validation");
const likeStatus_validation_1 = require("../core/middlewares/postRouterValidators/likeStatus.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
const composition_root_1 = require("../composition-root");
exports.commentRouter = (0, express_1.Router)({});
const commentsHandler = composition_root_1.container.get(CommentHandler_class_1.CommentHandler);
exports.commentRouter
    .put('/:commentId', bearerAuthorization_1.bearerGuard, commentId_validation_1.commentIdValidation, commentInput_validation_1.commentInputValidation, errors_middleware_1.checkValidationErrors, commentsHandler.changeCommentByCommentId.bind(commentsHandler))
    .put('/:commentId/like-status', bearerAuthorization_1.bearerGuard, commentId_validation_1.commentIdValidation, likeStatus_validation_1.likeStatusValidation, errors_middleware_1.checkValidationErrors, commentsHandler.changeCommentReaction.bind(commentsHandler))
    .get('/:id', bearerAuthorization_1.optionalBearerGuard, id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, commentsHandler.findCommentById.bind(commentsHandler))
    .delete('/:commentId', bearerAuthorization_1.bearerGuard, commentId_validation_1.commentIdValidation, errors_middleware_1.checkValidationErrors, commentsHandler.removeCommentByCommentId.bind(commentsHandler));
