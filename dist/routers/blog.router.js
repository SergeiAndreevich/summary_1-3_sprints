"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const BlogHandler_class_1 = require("../classes/Blog/BlogHandler.class");
const QueryRepo_class_1 = require("../classes/QueryRepo.class");
const BlogService_class_1 = require("../classes/Blog/BlogService.class");
const BlogRepo_class_1 = require("../classes/Blog/BlogRepo.class");
const basicAuthorization_1 = require("../core/middlewares/guard/basicAuthorization");
const blogId_validation_1 = require("../core/middlewares/blogRouterValidators/blogId.validation");
const id_validation_1 = require("../core/middlewares/blogRouterValidators/id.validation");
const blogInput_validation_1 = require("../core/middlewares/blogRouterValidators/blogInput.validation");
const postToBlogInput_validation_1 = require("../core/middlewares/blogRouterValidators/postToBlogInput.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
exports.blogRouter = (0, express_1.Router)({});
const queryRepo = new QueryRepo_class_1.QueryRepo();
const blogRepo = new BlogRepo_class_1.BlogRepo();
const blogService = new BlogService_class_1.BlogService(blogRepo);
const blogHandler = new BlogHandler_class_1.BlogHandler(queryRepo, blogService);
exports.blogRouter
    .post('/', basicAuthorization_1.basicGuard, blogInput_validation_1.blogInputValidation, errors_middleware_1.checkValidationErrors, blogHandler.createBlog)
    .post('/:blogId/posts', basicAuthorization_1.basicGuard, blogId_validation_1.blogIdValidation, postToBlogInput_validation_1.postToBlogInputValidation, errors_middleware_1.checkValidationErrors, blogHandler.createPostForSpecificBlog)
    .put('/:id', basicAuthorization_1.basicGuard, id_validation_1.idValidation, blogInput_validation_1.blogInputValidation, errors_middleware_1.checkValidationErrors, blogHandler.changeBlogById)
    .get('/:id', id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, blogHandler.findSpecificBlogById)
    .get('/:blogId/posts', blogId_validation_1.blogIdValidation, errors_middleware_1.checkValidationErrors, blogHandler.findPostsForSpecificBlogId)
    .get('/', blogHandler.findBlogsByFilter)
    .delete('/:id', id_validation_1.idValidation, errors_middleware_1.checkValidationErrors, blogHandler.deleteSpecificBlog);
