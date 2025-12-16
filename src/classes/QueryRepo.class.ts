import {IResult} from "../settings/types/resultObject";
import {UserModel} from "../settings/database/UserModel.mongoose";
import {mapUserToView} from "../core/mappers/userViewModel.mapper";
import {TypeDBUser, TypeUserView} from "../settings/types/user.types";

export class QueryRepo {
    async findUserByLoginOrEmail(login:string, email: string): Promise<TypeUserView | null> {
    const user = await UserModel.findOne(
        {$or: [{login }, { email }]}).lean<TypeDBUser>();
    if (!user) {
        return null
    }
    return mapUserToView(user)
    }
}