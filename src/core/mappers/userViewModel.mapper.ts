import {TypeDBUser, TypeDBUserWithMeta, TypeUserView} from "../../settings/types/user.types";
import {ObjectId} from "mongodb";

export function mapUserToView(user: TypeDBUserWithMeta): TypeUserView {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.createdAt.toISOString()
    }
}