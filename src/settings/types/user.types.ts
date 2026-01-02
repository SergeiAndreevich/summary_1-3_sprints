import {Types} from "mongoose";

export type TypeUserInput = {
    login: string,
    email: string,
    password: string
}

export type TypeDBUser = {
    createdAt: Date
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
export type TypeDBUserWithMeta = {
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

export type TypeUserFrontView = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}
export type TypeUserBackView = {
    id: string,
    createdAt: string,
    updatedAt: string,
    accountData: {
        login: string,
        email: string,
        password: string
    },
    emailConfirmation: {
        confirmationCode: string | null,
        isConfirmed: boolean,
        expirationDate: Date
    },
    passwordRecovery:{
        confirmationCode: string | null,
        isConfirmed: boolean,
        expirationDate: Date
    }
}