"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepo = void 0;
const UserModel_mongoose_1 = require("../../settings/database/UserModel.mongoose");
const date_fns_1 = require("date-fns");
const inversify_1 = require("inversify");
let AuthRepo = class AuthRepo {
    async recoveryPassword(email, confirmationCode) {
        //проверяем, есть ли такой email
        const user = await UserModel_mongoose_1.UserModel.findOne({ "accountData.email": email });
        if (!user) {
            return false;
        }
        //заготовка данных для вставки
        const newRecovery = {
            confirmationCode: confirmationCode,
            expirationDate: (0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 2,
            }),
            isConfirmed: false
        };
        //обновлем у юзера поля в passwordRecovery
        const isUpdated = await UserModel_mongoose_1.UserModel.updateOne({ _id: user._id }, { $set: { "passwordRecovery.confirmationCode": newRecovery.confirmationCode,
                "passwordRecovery.expirationDate": newRecovery.expirationDate,
                "passwordRecovery.isConfirmed": newRecovery.isConfirmed
            }
        });
        return isUpdated.matchedCount === 1;
    }
    async setNewPassword(newPassword, recoveryCode) {
        const user = await UserModel_mongoose_1.UserModel.findOne({ "passwordRecovery.confirmationCode": recoveryCode }).lean();
        if (!user ||
            user.passwordRecovery.isConfirmed === true ||
            new Date() > user.passwordRecovery.expirationDate) {
            return false;
        }
        const isSet = await UserModel_mongoose_1.UserModel.updateOne({ _id: user._id }, { $set: { "accountData.password": newPassword, "passwordRecovery.confirmationCode": recoveryCode, "passwordRecovery.isConfirmed": true } });
        return isSet.matchedCount === 1;
    }
};
exports.AuthRepo = AuthRepo;
exports.AuthRepo = AuthRepo = __decorate([
    (0, inversify_1.injectable)()
], AuthRepo);
