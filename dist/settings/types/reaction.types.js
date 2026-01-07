"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesForReaction = exports.ReactionType = void 0;
var ReactionType;
(function (ReactionType) {
    ReactionType["like"] = "like";
    ReactionType["dislike"] = "dislike";
    ReactionType["none"] = "none";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
var EntitiesForReaction;
(function (EntitiesForReaction) {
    EntitiesForReaction["blog"] = "blog";
    EntitiesForReaction["post"] = "post";
    EntitiesForReaction["comment"] = "comment";
})(EntitiesForReaction || (exports.EntitiesForReaction = EntitiesForReaction = {}));
