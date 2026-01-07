import {CommentRepo} from "./CommentRepo.class";
import {TypeCommentFrontView, TypeCommentInput} from "../../settings/types/comment.types";
import {IResult} from "../../settings/types/resultObject";
import {httpStatus} from "../../settings/types/httpStatuses";
import {EntitiesForReaction, ReactionType, TypeReactionInput} from "../../settings/types/reaction.types";
import {likesCounterHelper} from "../../core/helpers/likeCounter.helper";
import {ReactionsRepo} from "../ReactionsRepo.class";


export class CommentService {
    constructor(private commentRepo: CommentRepo,
                private reactionsRepo: ReactionsRepo) {}

    async changeCommentByCommentId(commentId: string, input: TypeCommentInput, userId: string):Promise<IResult<null>> {
        const comment = await this.commentRepo.findCommentById(commentId);
        if(!comment){
            return {data: null, status: httpStatus.NotFound, error: {field: 'commentId', message: 'Comment not found'}}
        }
        const isUpdated = await this.commentRepo.changeCommentById(commentId, input, userId);
        if(!isUpdated){
            return {data: null, status: httpStatus.Forbidden, error: {field: 'userId', message: 'Not your comment'}}
        }
        return {data: null, status: httpStatus.NoContent}
    }
    async changeCommentReaction(commentId: string, input: TypeReactionInput, userId: string):Promise<IResult<null>>{
        const  comment = await this.commentRepo.findCommentById(commentId);
        if(!comment){
            return {data: null, status: httpStatus.NotFound, error: {field: 'commentId', message: 'Comment not found'}}
        }
        const isUpdated = await this.reactionsRepo.toggleReaction(commentId, EntitiesForReaction.comment, userId, input.LikeStatus);
        if (isUpdated === false) {
            return {
                data: null,
                status: httpStatus.ExtraError,
                error: { field: 'reaction', message: 'Reaction not changed' }
            };
        }
        return {data: null, status: httpStatus.NoContent}
    }

    async findCommentById(commentId: string, userId:string | undefined): Promise<IResult<null | TypeCommentFrontView>> {
        const comment = await this.commentRepo.findCommentById(commentId);
        if(!comment){
            return {data: null, status:httpStatus.NotFound, error:  {field: 'commentId', message: 'Comment not found'}}
        }
        const {reactionMap, myStatusMap} = await likesCounterHelper.getLikesForEntity(EntitiesForReaction.comment, [commentId], userId);
        const commentToView = {
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: reactionMap[commentId]?.likes ?? 0,
                dislikesCount: reactionMap[commentId]?.dislikes ?? 0,
                myStatus:  myStatusMap[commentId] ?? ReactionType.none
            }
        }
        return {data: commentToView, status:httpStatus.Ok}
    }

    async removeCommentByCommentId(commentId:string, userId:string):Promise<IResult<null>> {
        const comment = await this.commentRepo.findCommentById(commentId);
        if(!comment){
            return {data:  null, status: httpStatus.NotFound, error: {field: 'commentId', message: 'Comment not found'}}
        }
        const isDeleted = await this.commentRepo.removeCommentByCommentId(commentId, userId);
        if(!isDeleted){
            return {data: null, status: httpStatus.Forbidden, error: {field: 'commentId', message: 'Not your comment'}}
        }
        return {data: null, status: httpStatus.NoContent}
    }
}