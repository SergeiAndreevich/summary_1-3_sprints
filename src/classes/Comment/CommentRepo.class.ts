import {TypeCommentatorInfo, TypeCommentFrontView, TypeCommentInput} from "../../settings/types/comment.types";
import {mapCommentToView} from "../../core/mappers/commentViewModel.mapper";
import {CommentModel} from "../../settings/database/CommentModel.mongoose";
import {Comment} from "../../core/fabric/Comment.class";

export class CommentRepo {
    async createCommentForSpecificPost(postId: string, dto: TypeCommentInput, user:TypeCommentatorInfo):Promise<TypeCommentFrontView>{
        const comment = Comment.create(postId, dto, user);
        const insertedComment = await CommentModel.create(comment.toDB())
        return mapCommentToView(insertedComment)
    }
}