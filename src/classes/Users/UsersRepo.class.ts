import {TypeUserView} from "../../settings/types/user.types";
import {UserModel} from "../../settings/database/UserModel.mongoose";
import {mapUserToView} from "../../core/mappers/userViewModel.mapper";
import {User} from "../../core/fabric/User.class";

export class UsersRepo {
    async createUser(login: string, email: string, passwordHash: string):Promise<void>{
        const user = User.create(login, email,passwordHash);
        await UserModel.create(user.toDB());
        return
    }
    async confirmEmail(userId: string){
        const result = await UserModel.updateOne({_id: userId},
            {$set: {"emailConfirmation.isConfirmed": true}});
        if(result.acknowledged && result.modifiedCount === 1){
            return
        }
        throw new Error('Update is not successful');
    }
}