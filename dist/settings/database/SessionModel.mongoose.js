"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sessionSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    deviceName: { type: String, required: true },
    lastActivity: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, required: true, default: false },
});
exports.SessionModel = mongoose_1.default.model("Session", sessionSchema);
