"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const basicAuthorization_1 = require("../core/middlewares/guard/basicAuthorization");
const PostsHandler_class_1 = require("../classes/Post/PostsHandler.class");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const postId_validation_1 = require("../core/middlewares/postRouterValidators/postId.validation");
const id_validation_1 = require("../core/middlewares/postRouterValidators/id.validation");
const postInput_validation_1 = require("../core/middlewares/postRouterValidators/postInput.validation");
const commentInput_validation_1 = require("../core/middlewares/postRouterValidators/commentInput.validation");
const likeStatus_validation_1 = require("../core/middlewares/postRouterValidators/likeStatus.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
const composition_root_1 = require("../composition-root");
exports.postRouter = (0, express_1.Router)({});
const postHandler = composition_root_1.container.get(PostsHandler_class_1.PostHandler);
exports.postRouter
    .post('/', basicAuthorization_1.basicGuard, postInput_validation_1.postInputValidation, postHandler.createPost.bind(postHandler))
    .post('/:postId/comments', bearerAuthorization_1.bearerGuard, postId_validation_1.postIdValidation, commentInput_validation_1.commentInputValidation, errors_middleware_1.checkValidationErrors, postHandler.createCommentForSpecificPostId.bind(postHandler))
    .put('/:id', basicAuthorization_1.basicGuard, id_validation_1.idValidation, postInput_validation_1.postInputValidation, errors_middleware_1.checkValidationErrors, postHandler.updatePostById.bind(postHandler))
    .put('/:postId/like-status', bearerAuthorization_1.bearerGuard, postId_validation_1.postIdValidation, likeStatus_validation_1.likeStatusValidation, errors_middleware_1.checkValidationErrors, postHandler.changeReactionByPostId.bind(postHandler))
    .get('/:id', bearerAuthorization_1.optionalBearerGuard, id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, postHandler.findPostById.bind(postHandler))
    .get('/:postId/comments', bearerAuthorization_1.optionalBearerGuard, postId_validation_1.postIdValidation, errors_middleware_1.checkValidationErrors, postHandler.findCommentsByPostId.bind(postHandler))
    .get('/', bearerAuthorization_1.optionalBearerGuard, postHandler.findPostsByFilter.bind(postHandler))
    .delete('/:id', id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, postHandler.removePostById.bind(postHandler));
