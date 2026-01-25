"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsRepo = void 0;
const reaction_types_1 = require("../settings/types/reaction.types");
const ReactionModel_mongoose_1 = require("../settings/database/ReactionModel.mongoose");
const inversify_1 = require("inversify");
let ReactionsRepo = class ReactionsRepo {
    // async toggleReaction(entityId: string, entityType: EntitiesForReaction, userId:string, status:ReactionType){
    //     const existing = await ReactionModel.findOne({ entityId, entityType, userId });
    //
    //     //допустим решили поставить лайк, тгда создаем запись реакции
    //     if (!existing && status !== ReactionType.none) {
    //         await ReactionModel.create({
    //             entityId,
    //             entityType,
    //             userId,
    //             status,
    //             addedAt: new Date()
    //         });
    //         return true;
    //     }
    //
    //     //вот эту логику не понимаю (может чисто обработка ошибки в БД)
    //     if (!existing) return false;
    //
    //     //если запись реакции уже есть и статус совпал, например, дабл-клик на лайк
    //     if (existing.status === status) {
    //         await ReactionModel.deleteOne({ _id: existing._id });
    //         return true;
    //     }
    //
    //     //это если решил поменять лайк на дизлайк. Запись удалять не нужно, просто меняем статус
    //     await ReactionModel.updateOne(
    //         { _id: existing._id },
    //         { $set: { status, addedAt: new Date() } }
    //     );
    //     return true;
    // }
    async toggleReaction(entityId, entityType, userId, status) {
        const existing = await ReactionModel_mongoose_1.ReactionModel.findOne({ entityId, entityType, userId });
        // нет реакции
        if (!existing) {
            if (status === reaction_types_1.ReactionType.none)
                return true;
            await ReactionModel_mongoose_1.ReactionModel.create({
                entityId,
                entityType,
                userId,
                status,
                addedAt: new Date()
            });
            return true;
        }
        // есть реакция
        if (status === reaction_types_1.ReactionType.none) {
            await ReactionModel_mongoose_1.ReactionModel.deleteOne({ _id: existing._id });
            return true;
        }
        // статус не изменился → ничего не делаем
        if (existing.status === status) {
            return true;
        }
        // смена лайк ↔ дизлайк
        await ReactionModel_mongoose_1.ReactionModel.updateOne({ _id: existing._id }, { $set: { status, addedAt: new Date() } });
        return true;
    }
};
exports.ReactionsRepo = ReactionsRepo;
exports.ReactionsRepo = ReactionsRepo = __decorate([
    (0, inversify_1.injectable)()
], ReactionsRepo);
