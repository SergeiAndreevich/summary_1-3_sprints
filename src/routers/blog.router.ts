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
    .post('/', basicGuard, blogInputValidation, checkValidationErrors, blogHandler.createBlog.bind(blogHandler))
    .post('/:blogId/posts', basicGuard, blogIdValidation, postToBlogInputValidation, checkValidationErrors, blogHandler.createPostForSpecificBlog.bind(blogHandler))
    .put('/:id', basicGuard, idValidation, blogInputValidation, checkValidationErrors, blogHandler.changeBlogById.bind(blogHandler))
    .get('/:id', idValidation, checkValidationErrors, blogHandler.findSpecificBlogById.bind(blogHandler))
    .get('/:blogId/posts', blogIdValidation, checkValidationErrors, blogHandler.findPostsForSpecificBlogId.bind(blogHandler))
    .get('/', blogHandler.findBlogsByFilter.bind(blogHandler))
    .delete('/:id', idValidation, checkValidationErrors, blogHandler.deleteSpecificBlog.bind(blogHandler))
