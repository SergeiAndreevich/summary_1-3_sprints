"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reaction_types_1 = require("../types/reaction.types");
const ReactionSchema = new mongoose_1.default.Schema({
    entityId: { type: String, required: true },
    entityType: { type: String, enum: [reaction_types_1.EntitiesForReaction.blog, reaction_types_1.EntitiesForReaction.post, reaction_types_1.EntitiesForReaction.comment], required: true },
    userId: { type: String, required: true },
    status: { type: String, enum: [reaction_types_1.ReactionType.like, reaction_types_1.ReactionType.dislike, reaction_types_1.ReactionType.none], required: true },
    addedAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
});
ReactionSchema.index({ entityId: 1, entityType: 1, userId: 1 }, { unique: true });
ReactionSchema.index({ entityId: 1, entityType: 1, status: 1 });
ReactionSchema.index({ entityId: 1, entityType: 1, status: 1, addedAt: -1 });
exports.ReactionModel = mongoose_1.default.model('Reaction', ReactionSchema);
