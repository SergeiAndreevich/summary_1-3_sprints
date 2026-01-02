import {Router} from "express";
import {BlogHandler} from "../classes/Blog/BlogHandler.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {BlogService} from "../classes/Blog/BlogService.class";
import {BlogRepo} from "../classes/Blog/BlogRepo.class";
import {basicGuard} from "../core/middlewares/guard/basicAuthorization";
import {blogIdValidation} from "../core/middlewares/blogRouterValidators/blogId.validation";
import {idValidation} from "../core/middlewares/blogRouterValidators/id.validation";


const blogRouter = Router({});
const queryRepo = new QueryRepo();
const blogRepo = new BlogRepo();
const blogService = new BlogService(blogRepo);
const blogHandler = new BlogHandler(queryRepo, blogService);
blogRouter
    .post('/', basicGuard, blogHandler.createBlog)
    .post('/:blogId/posts', basicGuard, blogIdValidation, blogHandler.createPostForSpecificBlog)
    .put('/:id', basicGuard, idValidation, blogHandler.changeBlogById)
    .get('/:id', idValidation, blogHandler.findSpecificBlogById)
    .get('/:blogId/posts', blogIdValidation, blogHandler.findPostsForSpecificBlogId)
    .get('/', blogHandler.findBlogsByFilter)
    .delete('/:id', idValidation,blogHandler.deleteSpecificBlog)
