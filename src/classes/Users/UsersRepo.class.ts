import {UserModel} from "../../settings/database/UserModel.mongoose";
import {User} from "../../core/fabric/User.class";
import {TypeDBUser, TypeDBUserWithMeta, TypeUserBackView, TypeUserFrontView} from "../../settings/types/user.types";
import {mapUserWithMeta} from "../../core/mappers/userWithMeta.mapper";
import {mapUserToView} from "../../core/mappers/userViewModel.mapper";
import {WithMongoId} from "../../settings/database/db_settings";

export class UsersRepo {
    async createUser(user:User):Promise<TypeUserFrontView | null>{
        const createdUser = await UserModel.create(user.toDB());
        return mapUserToView(createdUser.toObject());
    }
    async deleteSpecificUser(userId:string){
        const user = await UserModel.findByIdAndDelete({userId});
        if (!user) {
            return null
        }
        return user
    }

    async findUserByConfirmationCode(confirmationCode:string):Promise<TypeUserBackView | null>{
        const user = await UserModel.findOne(
            {'emailConfirmation.confirmationCode': confirmationCode }
        ).lean<WithMongoId<TypeDBUser>>();
        if(!user){
            return null
        }
        return mapUserWithMeta(user)
    }
    async confirmEmail(userId: string){
        const result = await UserModel.updateOne({_id: userId,"emailConfirmation.isConfirmed": false},
            {$set: {"emailConfirmation.isConfirmed": true}});
        return result.matchedCount === 1
    }

    async findUserByEmail(email:string):Promise<TypeUserBackView | null>{
        const user = await UserModel.findOne(
            {'accountData.email': email}
        ).lean<WithMongoId<TypeDBUser>>();
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
                ]}).lean<WithMongoId<TypeDBUser>>();
        if (!user) {
            return null
        }
        return mapUserWithMeta(user)
    }
    async findUserById(userId:string):Promise<TypeUserBackView | null> {
        const user = await UserModel.findById(userId).lean<WithMongoId<TypeDBUser>>();
        if(!user){
            return null
        }
        return mapUserWithMeta(user)
    }
}