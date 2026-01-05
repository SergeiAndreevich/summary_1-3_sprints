import {UserModel} from "../../settings/database/UserModel.mongoose";
import {add} from "date-fns";
import {WithMongoId} from "../../settings/database/db_settings";
import {TypeDBUser} from "../../settings/types/user.types";
import {JwtPayload} from "jsonwebtoken";
import {SessionModel} from "../../settings/database/SessionModel.mongoose";
import {TypeSession} from "../../settings/types/session.types";
import {ObjectId} from "mongodb";

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
            {$set: {"passwordRecovery.confirmationCode":recoveryCode, "passwordRecovery.isConfirmed":true}})
        return isSet.matchedCount === 1
    }

    // async updateRefreshToken(refreshToken:string): Promise<IResult<null | {accessToken: string, refreshToken: string}>> {
    //     //раскукоживаем рефреш-токен и получаем оттуда данные
    //     const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
    //     if (!decodedRefresh) {
    //         return {data:null, status:ResultStatuses.unauthorized}
    //     }
    //     const result = await this.authRepo.updateTokens(decodedRefresh!);
    //     return {data: result.data, status: result.status, errorMessage: result.errorMessage}
    // }
    // async removeRefreshToken(refreshToken:string): Promise<IResult<null>> {
    //     const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
    //     if(!decodedRefresh){
    //         return {data: null, status: ResultStatuses.unauthorized, errorMessage: {field: 'refreshToken', message: 'Refresh token is empty'}};
    //     }
    //
    //     const result = await this.authRepo.removeRefreshToken(decodedRefresh);
    //     return {data: result.data, status: result.status}
    // }
}