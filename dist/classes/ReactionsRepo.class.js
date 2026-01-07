"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsRepo = void 0;
const reaction_types_1 = require("../settings/types/reaction.types");
const ReactionModel_mongoose_1 = require("../settings/database/ReactionModel.mongoose");
class ReactionsRepo {
    async toggleReaction(entityId, entityType, userId, status) {
        const existing = await ReactionModel_mongoose_1.ReactionModel.findOne({ entityId, entityType, userId });
        //допустим решили поставить лайк, тгда создаем запись реакции
        if (!existing && status !== reaction_types_1.ReactionType.none) {
            await ReactionModel_mongoose_1.ReactionModel.create({
                entityId,
                entityType,
                userId,
                status,
                addedAt: new Date()
            });
            return true;
        }
        //вот эту логику не понимаю (может чисто обработка ошибки в БД)
        if (!existing)
            return false;
        //если запись реакции уже есть и статус совпал, например, дабл-клик на лайк
        if (existing.status === status) {
            await ReactionModel_mongoose_1.ReactionModel.deleteOne({ _id: existing._id });
            return true;
        }
        //это если решил поменять лайк на дизлайк. Запись удалять не нужно, просто меняем статус
        await ReactionModel_mongoose_1.ReactionModel.updateOne({ _id: existing._id }, { $set: { status, addedAt: new Date() } });
        return true;
    }
}
exports.ReactionsRepo = ReactionsRepo;
