import {TypePostInput, TypePostView} from "../../settings/types/post.types";
import {PostsRepo} from "./PostsRepo.class";
import {IResult} from "../../settings/types/resultObject";
import {httpStatus} from "../../settings/types/httpStatuses";
import {TypeCommentFrontView, TypeCommentInput} from "../../settings/types/comment.types";
import {UsersRepo} from "../Users/UsersRepo.class";
import {CommentRepo} from "../Comment/CommentRepo.class";
import {TypeReactionInput} from "../../settings/types/reaction.types";

export class PostsService {
    constructor(private postsRepo: PostsRepo,
                private usersRepo: UsersRepo,
                private commentRepo: CommentRepo){}
    async createPost(input:TypePostInput): Promise<IResult<null | TypePostView>>{
        const post = await this.postsRepo.createPost(input);
        if(!post){
            return {data: null, status: httpStatus.ExtraError};
        }
        return {data: post, status: httpStatus.Created}
    }
    async createCommentForSpecificPost(postId:string, input: TypeCommentInput, userId:string):Promise<IResult<null | TypeCommentFrontView>> {
        const post = await this.postsRepo.findPostById(postId);
        if(!post){
            return {data: null, status: httpStatus.NotFound, error: {field: 'postId', message: 'Post not found'}}
        }
        const commentator = await this.usersRepo.findUserById(userId);
        if(!commentator){
            return {data: null, status: httpStatus.NotFound, error: {field: 'userId', message: 'User not found'}}
        }
        const commentatorInfo = {userId, userLogin: commentator.accountData.login};
        const comment:TypeCommentFrontView = await this.commentRepo.createCommentForSpecificPost(postId, input,commentatorInfo);
        return {data: comment, status: httpStatus.Created};
    }

    async updatePostById(postId:string, input:TypePostInput): Promise<IResult<null>>{
        const post = await this.postsRepo.findPostById(postId);
        if(!post){
            return {data: null, status: httpStatus.NotFound, error: {field: 'postId', message: 'Post not found'}};
        }
        const isUpdated = await this.postsRepo.updatePostById(postId, input);
        if(!isUpdated){
            return {data: null, status: httpStatus.ExtraError, error: {field: 'database', message: 'Post not updated'}};
        }
        return {data: null, status: httpStatus.NoContent};
    }
    async changeReactionByPostId(postId:string, userId: string, input:TypeReactionInput):Promise<IResult<null>>{
        const post = await this.postsRepo.findPostById(postId);
        if(!post){
            return {data: null, status: httpStatus.NotFound, error: {field: 'postId', message: 'Post not found'}};
        }
        const result = await this.postsRepo.changeReactionByPostId(postId, userId, input);
        if(!result){
            return {data: null, status: httpStatus.ExtraError, error: {field: 'database', message: 'Reaction not updated'}};
        }
        return {data: null, status: httpStatus.NoContent};
    }
}