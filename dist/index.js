"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setupApp_1 = require("./setupApp");
const db_settings_1 = require("./settings/database/db_settings");
async function main() {
    const app = (0, express_1.default)(); //создали экземпляр приложения
    app.set('trust proxy', true);
    (0, setupApp_1.setupApp)(app); //в отдельной функции подключили middleware и роуты
    const PORT = process.env.PORT || 5005; //выделили порт для приложения
    //подключаем mongoose
    await (0, db_settings_1.runMongoose)();
    //и начали слушать, ждать команд для исполнения
    app.listen(PORT, () => {
    });
}
main();
