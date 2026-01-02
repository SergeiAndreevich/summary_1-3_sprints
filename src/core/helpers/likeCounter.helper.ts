import {EntitiesForReaction, ReactionType, TypeLikeDetails} from "../../settings/types/reaction.types";
import {ReactionModel} from "../../settings/database/ReactionModel.mongoose";
import {WithMongoId} from "../../settings/database/db_settings";

export const likesCounterHelper = {
    async getLikesForEntity(entityType:EntitiesForReaction, ids: string[], userId?:string ){
        const likesAggregation = await ReactionModel.aggregate([
            {
                $match: {
                    entityType: entityType,
                    entityId: { $in: ids },
                    status: ReactionType.like // ⚠️ ТОЛЬКО лайки для newestLikes
                }
            },
            { $sort: { addedAt: -1 } },
            {
                $group: {
                    _id: '$entityId',
                    likesCount: { $sum: 1 },
                    newestLikes: {
                        $push: {
                            userId: '$userId',
                            addedAt: '$addedAt'
                        }
                    }
                }
            },
            {
                $project: {
                    likesCount: 1,
                    newestLikes: { $slice: ['$newestLikes', 3] }
                }
            }
        ])
        const dislikesAggregation = await ReactionModel.aggregate([
            {
                $match: {
                    entityType: entityType,
                    entityId: { $in: ids },
                    status: ReactionType.dislike
                }
            },
            {
                $group: {
                    _id: '$entityId',
                    dislikesCount: { $sum: 1 }
                }
            }
        ])
        let myStatusMap: Record<string, ReactionType> = {}

        if (userId) {
            const statuses = await ReactionModel.find({
                entityType: entityType,
                entityId: { $in: ids },
                userId
            }).lean()
            for (const s of statuses) {
                myStatusMap[s.entityId] = s.status
            }
        }

        const reactionMap: Record<string, {
            likes: number
            dislikes: number
            newestLikes: TypeLikeDetails[]
        }> = {}

        for (const l of likesAggregation) {
            reactionMap[l._id] = {
                likes: l.likesCount,
                dislikes: 0,
                newestLikes: l.newestLikes
            }
        }

        for (const d of dislikesAggregation) {
            reactionMap[d._id] ??= { likes: 0, dislikes: 0, newestLikes: [] }
            reactionMap[d._id].dislikes = d.dislikesCount
        }
        return {reactionMap, myStatusMap}
    }
}
