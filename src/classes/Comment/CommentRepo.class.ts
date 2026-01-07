import {
    TypeCommentatorInfo,
    TypeCommentDB,
    TypeCommentFrontView,
    TypeCommentInput
} from "../../settings/types/comment.types";
import {mapCommentToView} from "../../core/mappers/commentViewModel.mapper";
import {CommentModel} from "../../settings/database/CommentModel.mongoose";
import {Comment} from "../../core/fabric/Comment.class";
import {IPAginationAndSorting} from "../../settings/types/pagination.types";
import {WithMongoId} from "../../settings/database/db_settings";
import {ObjectId} from "mongodb";
import {EntitiesForReaction, TypeReactionInput} from "../../settings/types/reaction.types";
import {ReactionModel} from "../../settings/database/ReactionModel.mongoose";

export class CommentRepo {
    async createCommentForSpecificPost(postId: string, dto: TypeCommentInput, user:TypeCommentatorInfo):Promise<TypeCommentFrontView>{
        const comment = Comment.create(postId, dto, user);
        const insertedComment = await CommentModel.create(comment.toDB())
        return mapCommentToView(insertedComment)
    }

    async findCommentsByPostId(postId: string, query: IPAginationAndSorting){
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
            searchLoginTerm,
            searchEmailTerm
        } = query;
        const skip = (pageNumber - 1) * pageSize;
        const andFilters = [];
        andFilters.push();
        if (searchNameTerm) {
            andFilters.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }
        if (searchLoginTerm) {
            andFilters.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (searchEmailTerm) {
            andFilters.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        if (postId) {
            andFilters.push({ postId: { $regex: postId, $options: 'i' } });
        }

        const filter = andFilters.length > 0 ? { $or: andFilters } : {};
        const items = await CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean< WithMongoId<TypeCommentDB>[]>();
        const totalCount = await CommentModel.countDocuments(filter);
        const commentsToView = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((item) => mapCommentToView(item))
        }
        return commentsToView
    }
    async findCommentById(id:string){
        const comment = await CommentModel.findById(id).lean<WithMongoId<TypeCommentDB>>();
        if(!comment){
            return null
        }
        return mapCommentToView(comment)
    }

    async changeCommentById(commentId:string, dto: TypeCommentInput, userId:string){
        const comment = await CommentModel.findOne({_id: new ObjectId(commentId), "commentatorInfo.userId": userId }).lean<WithMongoId<TypeCommentDB>>();
        if(!comment){
            return false
        }
        const isUpdated = await CommentModel.updateOne(
            {_id: new ObjectId(commentId)},
            {$set: {content: dto.content}});
        return isUpdated.modifiedCount === 1
    }

    async removeCommentByCommentId(commentId:string, userId:string){
        const comment = await CommentModel.findOne({_id: new ObjectId(commentId), "commentatorInfo.userId": userId}).lean<WithMongoId<TypeCommentDB>>();
        if(!comment){
            return false
        }
        await CommentModel.deleteOne({_id: new ObjectId(commentId)})
        return true
    }
}