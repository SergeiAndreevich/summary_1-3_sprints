import mongoose from "mongoose";
import {TypeDBUser, TypeUserInput} from "../types/user.types";
import {TypeSession} from "../types/session.types";

const sessionSchema = new mongoose.Schema<TypeSession>({
    userId: {type: String, required: true},
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    lastActivity: {type: Date, required: true, default: Date.now},
    expiresAt: {type: Date, required: true},
    revoked: {type: Boolean, required: true, default: false},
})

export const SessionModel = mongoose.model("Session", sessionSchema);