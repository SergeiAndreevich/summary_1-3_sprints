"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesForReaction = exports.ReactionType = void 0;
var ReactionType;
(function (ReactionType) {
    ReactionType["like"] = "Like";
    ReactionType["dislike"] = "Dislike";
    ReactionType["none"] = "None";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
var EntitiesForReaction;
(function (EntitiesForReaction) {
    EntitiesForReaction["blog"] = "blog";
    EntitiesForReaction["post"] = "post";
    EntitiesForReaction["comment"] = "comment";
})(EntitiesForReaction || (exports.EntitiesForReaction = EntitiesForReaction = {}));
