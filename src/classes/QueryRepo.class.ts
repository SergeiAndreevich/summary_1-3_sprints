import {UserModel} from "../settings/database/UserModel.mongoose";
import {TypeDBUserWithMeta, TypeUserFrontView} from "../settings/types/user.types";
import {mapUserWithMeta} from "../core/mappers/userWithMeta.mapper";
import {mapUserToView} from "../core/mappers/userViewModel.mapper";

export class QueryRepo {
    async findUserByLoginOrEmail(login:string, email: string): Promise<TypeUserFrontView | null> {
    const user = await UserModel.findOne(
        {$or: [
                { 'accountData.login': login },
                { 'accountData.email': email }
            ]}).lean<TypeDBUserWithMeta>();
    if (!user) {
        return null
    }
    return mapUserToView(user)
    }



}