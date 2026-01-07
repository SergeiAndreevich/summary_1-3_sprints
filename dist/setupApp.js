"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = setupApp;
const express_1 = __importDefault(require("express"));
const PATH_1 = require("./settings/PATH");
const auth_router_1 = require("./routers/auth.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function setupApp(app) {
    app.use((0, cookie_parser_1.default)()); //middleware для чтение cookie
    app.use(express_1.default.json()); //middleware для парсинга строк. Сетевые строки в объект js
    //базовый эндпоинт, стартовая страница
    app.get('/', (req, res) => {
        res.send('Go to: ______');
    });
    app.use(PATH_1.PATH.auth, auth_router_1.authRouter);
}
