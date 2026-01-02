import mongoose from "mongoose";
import {TypeDBUser, TypeUserInput} from "../types/user.types";

const userSchema = new mongoose.Schema<TypeDBUser>(
    {
        accountData: {
            login: {type: String, required: true, unique: true, minlength: 3, maxlength: 10, trim: true},
            email: {type: String, required: true, unique: true, trim: true},
            password: {type: String, required: true},
        },
        emailConfirmation: {
            confirmationCode: { type: String, required: true, default: null },
            expirationDate: { type: Date, required: true },
            isConfirmed: { type: Boolean, required: true, default: false },
        },
        passwordRecovery: {
            confirmationCode: { type: String, default: null },
            expirationDate: { type: Date, required: true },
            isConfirmed: { type: Boolean, required: true, default: false },
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)


export const UserModel = mongoose.model<TypeDBUser>('User', userSchema);