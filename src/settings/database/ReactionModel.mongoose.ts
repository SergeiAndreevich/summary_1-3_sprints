import mongoose from "mongoose";
import {EntitiesForReaction, ReactionType, TypeReaction} from "../types/reaction.types";

const ReactionSchema = new mongoose.Schema<TypeReaction>({
    entityId: {type: String, required: true},
    entityType: {type: String, enum:[EntitiesForReaction.blog, EntitiesForReaction.post, EntitiesForReaction.comment], required: true},
    userId: {type: String, required: true},
    status: {type: String, enum:[ReactionType.like, ReactionType.dislike, ReactionType.none], required: true},
    addedAt: {type: Date, default: Date.now}
},
    {
        versionKey: false,
    })

ReactionSchema.index(
    {entityId: 1, entityType: 1, userId: 1},
    {unique:true}
)
ReactionSchema.index(
    {entityId: 1, entityType: 1,  status: 1}
)
ReactionSchema.index(
    {entityId: 1, entityType: 1, status: 1, addedAt: -1}
)

export const ReactionModel = mongoose.model('Reaction',ReactionSchema);
