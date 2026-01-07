"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserWithMeta = mapUserWithMeta;
function mapUserWithMeta(user) {
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
        passwordRecovery: {
            confirmationCode: user.passwordRecovery.confirmationCode,
            isConfirmed: user.passwordRecovery.isConfirmed,
            expirationDate: user.emailConfirmation.expirationDate
        }
    };
}
