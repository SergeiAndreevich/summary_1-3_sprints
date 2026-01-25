import {
    EntitiesForReaction,
    ReactionType,
    TypeLikeDetails,
    TypeLikeDetailsFull
} from "../../settings/types/reaction.types";
import {ReactionModel} from "../../settings/database/ReactionModel.mongoose";
import {WithMongoId} from "../../settings/database/db_settings";
import {UserModel} from "../../settings/database/UserModel.mongoose";
import {TypeDBUser} from "../../settings/types/user.types";

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
                            login:  '$userLogin',
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
    },
    async extendLastLikesInfo(
        reactionMap: Record<string, {
            likes: number
            dislikes: number
            newestLikes: TypeLikeDetails[]
        }>
    ): Promise<Record<string, {
        likes: number
        dislikes: number
        newestLikes: TypeLikeDetailsFull[]
    }>> {

        // 1️⃣ собрать все userId
        const userIds = new Set<string>();

        for (const entity of Object.values(reactionMap)) {
            for (const like of entity.newestLikes) {
                userIds.add(like.userId);
            }
        }

        if (userIds.size === 0) return reactionMap as any;

        // 2️⃣ одним запросом получить юзеров
        const users = await UserModel.find(
            { _id: { $in: [...userIds] } },
            { 'accountData.login': 1 }
        ).lean();

        // 3️⃣ сделать мапу userId → login
        const loginMap = new Map<string, string>();
        for (const u of users) {
            loginMap.set(u._id.toString(), u.accountData.login);
        }

        // 4️⃣ расширить reactionMap
        const extendedMap: Record<string, any> = {};

        for (const [entityId, data] of Object.entries(reactionMap)) {
            extendedMap[entityId] = {
                ...data,
                newestLikes: data.newestLikes.map(like => ({
                    userId: like.userId,
                    addedAt: like.addedAt,
                    login: loginMap.get(like.userId) ?? 'unknown'
                }))
            };
        }

        return extendedMap;
    }
}

