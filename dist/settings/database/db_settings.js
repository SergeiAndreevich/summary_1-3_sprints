"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSettings = void 0;
exports.runMongoose = runMongoose;
exports.stopMongoose = stopMongoose;
const mongoose_1 = __importDefault(require("mongoose"));
exports.dbSettings = {
    PORT: process.env.PORT || 5005,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27018',
    DB_NAME: process.env.DB_NAME || 'mongodb'
};
async function runMongoose() {
    try {
        await mongoose_1.default.connect(exports.dbSettings.MONGO_URL, { dbName: exports.dbSettings.DB_NAME });
    }
    catch (err) {
        console.error('Mongoose connection error:', err);
        await mongoose_1.default.disconnect();
        throw new Error(`Could not connect to the database ${err}`);
    }
}
async function stopMongoose() {
    try {
        await mongoose_1.default.disconnect();
    }
    catch (err) {
        console.error('Mongoose connection error:', err);
        throw new Error(`Could not connect to the database ${err}`);
    }
}
