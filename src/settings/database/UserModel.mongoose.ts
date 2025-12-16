import mongoose from "mongoose";
import {TypeDBUser, TypeUserInput} from "../types/user.types";

const userSchema = new mongoose.Schema<TypeDBUser>({
    login: {type: String, required: true, unique: true, minlength: 3, maxLength: 10, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    passwordHash: {type: String, required: true},
},
    {timestamps: true, versionKey: false}
)

export const UserModel = mongoose.model<TypeDBUser>('User', userSchema);