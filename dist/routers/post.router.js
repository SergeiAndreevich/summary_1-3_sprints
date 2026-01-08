"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const basicAuthorization_1 = require("../core/middlewares/guard/basicAuthorization");
const QueryRepo_class_1 = require("../classes/QueryRepo.class");
const PostsHandler_class_1 = require("../classes/Post/PostsHandler.class");
const PostsRepo_class_1 = require("../classes/Post/PostsRepo.class");
const PostsService_class_1 = require("../classes/Post/PostsService.class");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const postId_validation_1 = require("../core/middlewares/postRouterValidators/postId.validation");
const CommentRepo_class_1 = require("../classes/Comment/CommentRepo.class");
const UsersRepo_class_1 = require("../classes/Users/UsersRepo.class");
const id_validation_1 = require("../core/middlewares/postRouterValidators/id.validation");
const postInput_validation_1 = require("../core/middlewares/postRouterValidators/postInput.validation");
const commentInput_validation_1 = require("../core/middlewares/postRouterValidators/commentInput.validation");
const likeStatus_validation_1 = require("../core/middlewares/postRouterValidators/likeStatus.validation");
const ReactionsRepo_class_1 = require("../classes/ReactionsRepo.class");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
exports.postRouter = (0, express_1.Router)({});
const queryRepo = new QueryRepo_class_1.QueryRepo();
const postsRepo = new PostsRepo_class_1.PostsRepo();
const commentRepo = new CommentRepo_class_1.CommentRepo();
const usersRepo = new UsersRepo_class_1.UsersRepo();
const reactionsRepo = new ReactionsRepo_class_1.ReactionsRepo();
const postsService = new PostsService_class_1.PostsService(postsRepo, usersRepo, commentRepo, reactionsRepo);
const postHandler = new PostsHandler_class_1.PostHandler(queryRepo, postsService);
exports.postRouter
    .post('/', basicAuthorization_1.basicGuard, postInput_validation_1.postInputValidation, postHandler.createPost)
    .post('/:postId/comments', bearerAuthorization_1.bearerGuard, postId_validation_1.postIdValidation, commentInput_validation_1.commentInputValidation, errors_middleware_1.checkValidationErrors, postHandler.createCommentForSpecificPostId)
    .put('/:id', basicAuthorization_1.basicGuard, id_validation_1.idValidation, postInput_validation_1.postInputValidation, errors_middleware_1.checkValidationErrors, postHandler.updatePostById)
    .put('/:postId/like-status', bearerAuthorization_1.bearerGuard, postId_validation_1.postIdValidation, likeStatus_validation_1.likeStatusValidation, errors_middleware_1.checkValidationErrors, postHandler.changeReactionByPostId)
    .get('/:id', bearerAuthorization_1.optionalBearerGuard, id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, postHandler.findPostById)
    .get('/:postId/comments', bearerAuthorization_1.optionalBearerGuard, postId_validation_1.postIdValidation, errors_middleware_1.checkValidationErrors, postHandler.findCommentsByPostId)
    .get('/', bearerAuthorization_1.optionalBearerGuard, postHandler.findPostsByFilter)
    .delete('/:id', id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, postHandler.removePostById);
