import {TypeDBUser} from "../../settings/types/user.types";
import {WithMongoId} from "../../settings/database/db_settings";

export  function mapUserWithMeta(user: WithMongoId<TypeDBUser>) {
    return {
        id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        accountData: {
            login: user.accountData.login,
            email: user.accountData.email,
            password: user.accountData.password
        },
        emailConfirmation: {
            confirmationCode: user.emailConfirmation.confirmationCode,
            isConfirmed: user.emailConfirmation.isConfirmed,
            expirationDate: user.emailConfirmation.expirationDate
        },
        passwordRecovery:{
            confirmationCode: user.passwordRecovery.confirmationCode,
            isConfirmed: user.passwordRecovery.isConfirmed,
            expirationDate: user.emailConfirmation.expirationDate
        }
    }
}