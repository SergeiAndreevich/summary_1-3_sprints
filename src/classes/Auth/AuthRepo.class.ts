import {UserModel} from "../../settings/database/UserModel.mongoose";
import {add} from "date-fns";
import {WithMongoId} from "../../settings/database/db_settings";
import {TypeDBUser} from "../../settings/types/user.types";


export class AuthRepo {
    async recoveryPassword(email:string, confirmationCode:string) {
        //проверяем, есть ли такой email
        const user = await UserModel.findOne({"accountData.email": email});
        if(!user) {
            return false
        }
        //заготовка данных для вставки
        const newRecovery = {
            confirmationCode:confirmationCode,
            expirationDate:add(new Date(),{
                hours: 1,
                minutes: 2,
            }),
            isConfirmed:  false
        }
        //обновлем у юзера поля в passwordRecovery
        const isUpdated = await UserModel.updateOne(
            { _id: user._id },
            { $set: { "passwordRecovery.confirmationCode":newRecovery.confirmationCode,
                    "passwordRecovery.expirationDate":newRecovery.expirationDate,
                    "passwordRecovery.isConfirmed":newRecovery.isConfirmed
                }
            }
        );
        return isUpdated.matchedCount === 1
    }
    async setNewPassword(newPassword: string, recoveryCode:string) {
        const user = await UserModel.findOne({"passwordRecovery.confirmationCode":recoveryCode}).lean<WithMongoId<TypeDBUser>>()
        if(!user ||
            user.passwordRecovery.isConfirmed === true ||
            new Date()> user.passwordRecovery.expirationDate) {
            return false
        }
        const isSet = await UserModel.updateOne({_id: user._id},
            {$set: {"accountData.password":newPassword,"passwordRecovery.confirmationCode":recoveryCode, "passwordRecovery.isConfirmed":true}})
        return isSet.matchedCount === 1
    }
}