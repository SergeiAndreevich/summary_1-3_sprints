import {ObjectId} from "mongodb";

export type TypeUserInput = {
    login: string,
    email: string,
    password: string
}

export type TypeDBUser = {
    _id: ObjectId,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date
}

export type TypeUserView = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}