import {EntitiesForReaction, ReactionType} from "../settings/types/reaction.types";
import {ReactionModel} from "../settings/database/ReactionModel.mongoose";

export class ReactionsRepo {
    async toggleReaction(entityId: string, entityType: EntitiesForReaction, userId:string, status:ReactionType){
        const existing = await ReactionModel.findOne({ entityId, entityType, userId });

        //допустим решили поставить лайк, тгда создаем запись реакции
        if (!existing && status !== ReactionType.none) {
            await ReactionModel.create({
                entityId,
                entityType,
                userId,
                status,
                addedAt: new Date()
            });
            return true;
        }

        //вот эту логику не понимаю (может чисто обработка ошибки в БД)
        if (!existing) return false;

        //если запись реакции уже есть и статус совпал, например, дабл-клик на лайк
        if (existing.status === status) {
            await ReactionModel.deleteOne({ _id: existing._id });
            return true;
        }

        //это если решил поменять лайк на дизлайк. Запись удалять не нужно, просто меняем статус
        await ReactionModel.updateOne(
            { _id: existing._id },
            { $set: { status, addedAt: new Date() } }
        );
        return true;
    }
}