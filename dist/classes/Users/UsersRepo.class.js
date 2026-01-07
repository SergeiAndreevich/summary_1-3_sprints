"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepo = void 0;
const UserModel_mongoose_1 = require("../../settings/database/UserModel.mongoose");
const userWithMeta_mapper_1 = require("../../core/mappers/userWithMeta.mapper");
const userViewModel_mapper_1 = require("../../core/mappers/userViewModel.mapper");
class UsersRepo {
    async createUser(user) {
        const createdUser = await UserModel_mongoose_1.UserModel.create(user.toDB());
        return (0, userViewModel_mapper_1.mapUserToView)(createdUser.toObject());
    }
    async deleteSpecificUser(userId) {
        const user = await UserModel_mongoose_1.UserModel.findByIdAndDelete({ userId });
        if (!user) {
            return null;
        }
        return user;
    }
    async findUserByConfirmationCode(confirmationCode) {
        const user = await UserModel_mongoose_1.UserModel.findOne({ 'emailConfirmation.confirmationCode': confirmationCode }).lean();
        if (!user) {
            return null;
        }
        return (0, userWithMeta_mapper_1.mapUserWithMeta)(user);
    }
    async confirmEmail(userId) {
        const result = await UserModel_mongoose_1.UserModel.updateOne({ _id: userId, "emailConfirmation.isConfirmed": false }, { $set: { "emailConfirmation.isConfirmed": true } });
        return result.matchedCount === 1;
    }
    async findUserByEmail(email) {
        const user = await UserModel_mongoose_1.UserModel.findOne({ 'accountData.email': email }).lean();
        if (!user) {
            return null;
        }
        return (0, userWithMeta_mapper_1.mapUserWithMeta)(user);
    }
    async findUserByLoginOrEmail(login, email) {
        const user = await UserModel_mongoose_1.UserModel.findOne({ $or: [
                { 'accountData.login': login },
                { 'accountData.email': email }
            ] }).lean();
        if (!user) {
            return null;
        }
        return (0, userWithMeta_mapper_1.mapUserWithMeta)(user);
    }
    async findUserById(userId) {
        const user = await UserModel_mongoose_1.UserModel.findById(userId).lean();
        if (!user) {
            return null;
        }
        return (0, userWithMeta_mapper_1.mapUserWithMeta)(user);
    }
}
exports.UsersRepo = UsersRepo;
