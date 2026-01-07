"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    accountData: {
        login: { type: String, required: true, unique: true, minlength: 3, maxlength: 10, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
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
}, {
    timestamps: true,
    versionKey: false
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
