import {TypeDBUser, TypeUserFrontView} from "../../settings/types/user.types";
import {WithMongoId} from "../../settings/database/db_settings";

export function mapUserToView(user: WithMongoId<TypeDBUser>): TypeUserFrontView {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.createdAt.toISOString()
    }
}