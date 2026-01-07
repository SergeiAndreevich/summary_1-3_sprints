"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptHelper = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.bcryptHelper = {
    async encryptPassword(password) {
        await bcrypt_1.default.genSalt();
        await bcrypt_1.default.hash(password, 20);
        await bcrypt_1.default.compare(password, password);
        return password;
    },
    async generateHash(password) {
        return await bcrypt_1.default.hash(password, 10);
    },
    async comparePassword(inputPassword, passwordFromDB) {
        return await bcrypt_1.default.compare(inputPassword, passwordFromDB);
    }
};
