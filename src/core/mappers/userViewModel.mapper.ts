import {TypeDBUserWithMeta, TypeUserFrontView} from "../../settings/types/user.types";

export function mapUserToView(user: TypeDBUserWithMeta): TypeUserFrontView {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.createdAt.toISOString()
    }
}