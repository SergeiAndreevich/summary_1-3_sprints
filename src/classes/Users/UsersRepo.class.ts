import {TypeUserView} from "../../settings/types/user.types";
import {UserModel} from "../../settings/database/UserModel.mongoose";
import {mapUserToView} from "../../core/mappers/userViewModel.mapper";

export class UsersRepo {
    async createUser(login: string, email: string, passwordHash: string):Promise<TypeUserView>{
        const inputData = {login, email,passwordHash};
        const user = await UserModel.create(inputData);
        return mapUserToView(user)
    }
}