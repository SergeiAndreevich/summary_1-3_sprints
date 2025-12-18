import {TypeDBUserWithMeta} from "../../settings/types/user.types";

export  function mapUserWithMeta(user: TypeDBUserWithMeta) {
    return {
        id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        accountData: {
            login: user.accountData.login,
            email: user.accountData.email
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