import {UserModel} from "../settings/database/UserModel.mongoose";
import {mapUserToView} from "../core/mappers/userViewModel.mapper";
import {TypeDBUser, TypeDBUserWithMeta, TypeUserView} from "../settings/types/user.types";
import {ObjectId} from "mongodb";
import {mapUserWithMeta} from "../core/mappers/userWithMeta.mapper";

export class QueryRepo {
    async findUserByLoginOrEmail(login:string, email: string): Promise<TypeUserView | null> {
    const user = await UserModel.findOne(
        {$or: [
                { 'accountData.login': login },
                { 'accountData.email': email }
            ]}).lean<TypeDBUserWithMeta >();
    if (!user) {
        return null
    }
    return mapUserToView(user)
    }
    async findUserByConfirmationCode(confirmationCode:string){
        const user = await UserModel.findOne(
            {'accountData.email': confirmationCode }
        ).lean<TypeDBUserWithMeta>();
        if(!user){
            return null
        }
        return mapUserWithMeta(user)
    }
}