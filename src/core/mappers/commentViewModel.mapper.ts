import {WithMongoId} from "../../settings/database/db_settings";
import {TypeCommentDB, TypeCommentFrontView} from "../../settings/types/comment.types";
import {ReactionType} from "../../settings/types/reaction.types";

export function mapCommentToView(dto: WithMongoId<TypeCommentDB>):TypeCommentFrontView{
    return{
        id: dto._id.toString(),
        content: dto.content,
        commentatorInfo: {
            userId: dto.commentatorInfo.userId,
            userLogin: dto.commentatorInfo.userLogin
        },
        createdAt: dto.createdAt.toISOString(),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: ReactionType.none
        }
    }
}