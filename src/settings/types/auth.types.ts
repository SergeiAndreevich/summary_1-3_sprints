export type TypeRegistrationInput = {
    "login": string,
    "password": string,
    "email": string
}

export type TypePasswordRecoveryInput = {
    newPassword: string,
    recoveryCode: string
}

export type TypeTokens = {
    accessToken: string,
    refreshToken: string
}
export type TypeEmailConfirmationCode = {
    code: string,
}