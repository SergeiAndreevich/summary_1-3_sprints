import {UserModel} from "../../settings/database/UserModel.mongoose";
import {User} from "../../core/fabric/User.class";
import {TypeDBUserWithMeta, TypeUserBackView, TypeUserFrontView} from "../../settings/types/user.types";
import {mapUserWithMeta} from "../../core/mappers/userWithMeta.mapper";

export class UsersRepo {
    async createUser(login: string, email: string, passwordHash: string):Promise<void>{
        const user = User.create(login, email,passwordHash);
        await UserModel.create(user.toDB());
        return
    }
    async findUserByConfirmationCode(confirmationCode:string):Promise<TypeUserBackView | null>{
        const user = await UserModel.findOne(
            {'emailConfirmation.confirmationCode': confirmationCode }
        ).lean<TypeDBUserWithMeta>();
        if(!user){
            return null
        }
        return mapUserWithMeta(user)
    }
    async confirmEmail(userId: string){
        const result = await UserModel.updateOne({_id: userId},
            {$set: {"emailConfirmation.isConfirmed": true}});
        if(result.acknowledged && result.modifiedCount === 1){
            return
        }
        throw new Error('Update is not successful');
    }
    async findUserByEmail(email:string):Promise<TypeUserBackView | null>{
        const user = await UserModel.findOne(
            {'accountData.email': email}
        ).lean<TypeDBUserWithMeta>();
        if(!user){
            return null
        }
        return mapUserWithMeta(user)
    }
    async findUserByLoginOrEmail(login:string, email: string): Promise<TypeUserBackView | null> {
        const user = await UserModel.findOne(
            {$or: [
                    { 'accountData.login': login },
                    { 'accountData.email': email }
                ]}).lean<TypeDBUserWithMeta>();
        if (!user) {
            return null
        }
        return mapUserWithMeta(user)
    }
}