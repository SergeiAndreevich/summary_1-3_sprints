import {Router} from "express";
import {BlogHandler} from "../classes/Blog/BlogHandler.class";
import {basicGuard} from "../core/middlewares/guard/basicAuthorization";
import {blogIdValidation} from "../core/middlewares/blogRouterValidators/blogId.validation";
import {idValidation} from "../core/middlewares/blogRouterValidators/id.validation";
import {blogInputValidation} from "../core/middlewares/blogRouterValidators/blogInput.validation";
import {postToBlogInputValidation} from "../core/middlewares/blogRouterValidators/postToBlogInput.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {container} from "../composition-root";


export const blogRouter = Router({});
const blogHandler = container.get(BlogHandler);

blogRouter
    .post('/', basicGuard, blogInputValidation, checkValidationErrors, blogHandler.createBlog)
    .post('/:blogId/posts', basicGuard, blogIdValidation, postToBlogInputValidation, checkValidationErrors, blogHandler.createPostForSpecificBlog)
    .put('/:id', basicGuard, idValidation, blogInputValidation, checkValidationErrors, blogHandler.changeBlogById)
    .get('/:id', idValidation, checkValidationErrors, blogHandler.findSpecificBlogById)
    .get('/:blogId/posts', blogIdValidation, checkValidationErrors, blogHandler.findPostsForSpecificBlogId)
    .get('/', blogHandler.findBlogsByFilter)
    .delete('/:id', idValidation, checkValidationErrors, blogHandler.deleteSpecificBlog)
