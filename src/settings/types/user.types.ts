import {ObjectId} from "mongodb";

export type TypeUserInput = {
    login: string,
    email: string,
    password: string
}

export type TypeDBUser = {
    accountData: {
        login: string
        email: string
        password: string
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    passwordRecovery: {
        confirmationCode: string | null
        expirationDate: Date
        isConfirmed: boolean
    }
}
export type TypeDBUserWithMeta = {
    _id: ObjectId,
    createdAt: Date,
    updatedAt: Date,
    accountData: {
        login: string
        email: string
        password: string
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
    passwordRecovery: {
        confirmationCode: string | null
        expirationDate: Date
        isConfirmed: boolean
    }
}

export type TypeUserView = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}