"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesCounterHelper = void 0;
const reaction_types_1 = require("../../settings/types/reaction.types");
const ReactionModel_mongoose_1 = require("../../settings/database/ReactionModel.mongoose");
const UserModel_mongoose_1 = require("../../settings/database/UserModel.mongoose");
exports.likesCounterHelper = {
    async getLikesForEntity(entityType, ids, userId) {
        var _a;
        const likesAggregation = await ReactionModel_mongoose_1.ReactionModel.aggregate([
            {
                $match: {
                    entityType: entityType,
                    entityId: { $in: ids },
                    status: reaction_types_1.ReactionType.like // ⚠️ ТОЛЬКО лайки для newestLikes
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
                            login: '$userLogin',
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
        ]);
        const dislikesAggregation = await ReactionModel_mongoose_1.ReactionModel.aggregate([
            {
                $match: {
                    entityType: entityType,
                    entityId: { $in: ids },
                    status: reaction_types_1.ReactionType.dislike
                }
            },
            {
                $group: {
                    _id: '$entityId',
                    dislikesCount: { $sum: 1 }
                }
            }
        ]);
        let myStatusMap = {};
        if (userId) {
            const statuses = await ReactionModel_mongoose_1.ReactionModel.find({
                entityType: entityType,
                entityId: { $in: ids },
                userId
            }).lean();
            for (const s of statuses) {
                myStatusMap[s.entityId] = s.status;
            }
        }
        const reactionMap = {};
        for (const l of likesAggregation) {
            reactionMap[l._id] = {
                likes: l.likesCount,
                dislikes: 0,
                newestLikes: l.newestLikes
            };
        }
        for (const d of dislikesAggregation) {
            reactionMap[_a = d._id] ?? (reactionMap[_a] = { likes: 0, dislikes: 0, newestLikes: [] });
            reactionMap[d._id].dislikes = d.dislikesCount;
        }
        return { reactionMap, myStatusMap };
    },
    async extendLastLikesInfo(reactionMap) {
        // 1️⃣ собрать все userId
        const userIds = new Set();
        for (const entity of Object.values(reactionMap)) {
            for (const like of entity.newestLikes) {
                userIds.add(like.userId);
            }
        }
        if (userIds.size === 0)
            return reactionMap;
        // 2️⃣ одним запросом получить юзеров
        const users = await UserModel_mongoose_1.UserModel.find({ _id: { $in: [...userIds] } }, { 'accountData.login': 1 }).lean();
        // 3️⃣ сделать мапу userId → login
        const loginMap = new Map();
        for (const u of users) {
            loginMap.set(u._id.toString(), u.accountData.login);
        }
        // 4️⃣ расширить reactionMap
        const extendedMap = {};
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
};
