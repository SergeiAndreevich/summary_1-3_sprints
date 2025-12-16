import {TypeDBUser, TypeUserView} from "../../settings/types/user.types";

export function mapUserToView(user: TypeDBUser): TypeUserView {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString()
    }
}