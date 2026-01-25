import {TypePostInput, TypePostView} from "../../settings/types/post.types";
import {PostsRepo} from "./PostsRepo.class";
import {IResult} from "../../settings/types/resultObject";
import {httpStatus} from "../../settings/types/httpStatuses";
import {TypeCommentFrontView, TypeCommentInput} from "../../settings/types/comment.types";
import {UsersRepo} from "../Users/UsersRepo.class";
import {CommentRepo} from "../Comment/CommentRepo.class";
import {EntitiesForReaction, ReactionType, TypeReactionInput} from "../../settings/types/reaction.types";
import {likesCounterHelper} from "../../core/helpers/likeCounter.helper";
import {IPAginationAndSorting, TypePaginatorObject} from "../../settings/types/pagination.types";
import {ReactionsRepo} from "../ReactionsRepo.class";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepo) private postsRepo: PostsRepo,
                @inject(UsersRepo) private usersRepo: UsersRepo,
                @inject(CommentRepo) private commentRepo: CommentRepo,
                @inject(ReactionsRepo) private reactionsRepo: ReactionsRepo){}
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
        const result = await this.reactionsRepo.toggleReaction(postId, EntitiesForReaction.post, userId, input.likeStatus);
        if(!result){
            return {data: null, status: httpStatus.ExtraError, error: {field: 'database', message: 'Reaction not updated'}};
        }
        return {data: null, status: httpStatus.NoContent};
    }

    async findPostById(postId: string, userId:string | undefined){
        const post = await this.postsRepo.findPostById(postId);
        if(!post){
            return {data: null, status: httpStatus.NotFound, error: {field: 'postId', message: 'Post not found'}};
        }
        const {reactionMap, myStatusMap} = await likesCounterHelper.getLikesForEntity(EntitiesForReaction.post, [postId], userId);
        const reactions = await likesCounterHelper.extendLastLikesInfo(reactionMap);
        const resultPost:TypePostView = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: reactions[postId]?.likes ?? 0,
                dislikesCount: reactions[postId]?.dislikes ?? 0,
                myStatus: userId
                    ? myStatusMap[postId] ?? ReactionType.none
                    : ReactionType.none,
                newestLikes: reactions[postId]?.newestLikes ?? []
            }
        }
        return {data: resultPost, status: httpStatus.Ok};
    }
    async findCommentsByPostId(postId: string, filter: IPAginationAndSorting, userId:string | undefined): Promise<IResult<null | TypePaginatorObject<TypeCommentFrontView[]>>> {
        const post = await this.postsRepo.findPostById(postId);
        if(!post){
            return {data: null, status: httpStatus.NotFound, error: {field: 'postId', message: 'Post not found'}};
        }
        const commentsList:TypePaginatorObject<TypeCommentFrontView[]> = await this.commentRepo.findCommentsByPostId(postId, filter);
        const commentIds = commentsList.items.map(c => c.id);
        const {reactionMap, myStatusMap} = await likesCounterHelper.getLikesForEntity(EntitiesForReaction.comment, commentIds, userId);
        const reactions = await likesCounterHelper.extendLastLikesInfo(reactionMap);
        const itemsWithReaction: TypeCommentFrontView[] = commentsList.items.map(i => {
            return {
                id: i.id,
                content: i.content,
                commentatorInfo: i.commentatorInfo,
                createdAt: i.createdAt,
                likesInfo: {
                    likesCount: reactions[i.id]?.likes ?? 0,
                    dislikesCount: reactions[i.id]?.dislikes ?? 0,
                    myStatus: myStatusMap[i.id] ?? ReactionType.none
                }
            }
        })
        const commentsListToView = {
            pagesCount: commentsList.pagesCount,
            page: commentsList.page,
            pageSize: commentsList.pageSize,
            totalCount: commentsList.totalCount,
            items: itemsWithReaction
        }
        return {data: commentsListToView, status: httpStatus.Ok}
    }
    async findPostsByFilter(filter: IPAginationAndSorting, userId: string | undefined):Promise<IResult<TypePaginatorObject<TypePostView[]>>>{
        const postsList:TypePaginatorObject<TypePostView[]> = await this.postsRepo.findPostsByFilter(filter);
        const postIds = postsList.items.map(p => p.id);
        const {reactionMap, myStatusMap} = await likesCounterHelper.getLikesForEntity(EntitiesForReaction.post, postIds, userId);
        const reactions = await likesCounterHelper.extendLastLikesInfo(reactionMap);
        const itemsWithReaction:TypePostView[] = postsList.items.map(i => {
            return {
                id: i.id,
                title: i.title,
                shortDescription: i.shortDescription,
                content: i.content,
                blogId: i.blogId,
                blogName: i.blogName,
                createdAt: i.createdAt,
                extendedLikesInfo: {
                    likesCount: reactions[i.id]?.likes ?? 0,
                    dislikesCount: reactions[i.id]?.dislikes ?? 0,
                    myStatus: myStatusMap[i.id] ?? ReactionType.none,
                    newestLikes: reactions[i.id]?.newestLikes ?? []
                }
            }
        })
        const postsListToView:TypePaginatorObject<TypePostView[]> = {
            pagesCount: postsList.pagesCount,
            page: postsList.page,
            pageSize: postsList.pageSize,
            totalCount: postsList.totalCount,
            items: itemsWithReaction
        }
        return {data: postsListToView, status: httpStatus.Ok}
    }

    async removePostById(postId: string):Promise<IResult<null>>{
        const post = await this.postsRepo.removePostById(postId);
        if(!post){
            return {data: null, status: httpStatus.NotFound,  error: {field: 'postId', message: 'Post not found'}};
        }
        return {data: null, status: httpStatus.NoContent}
    }
}