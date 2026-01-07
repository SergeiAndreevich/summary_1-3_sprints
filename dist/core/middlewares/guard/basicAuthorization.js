"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_PASSWORD = exports.ADMIN_USERNAME = void 0;
exports.basicGuard = basicGuard;
const httpStatuses_1 = require("../../../settings/types/httpStatuses");
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
function basicGuard(req, res, next) {
    //Basic-авторизация это строка Basic gfsladfasj:sfhdksdfh
    const auth = req.headers.authorization;
    if (auth === '' || auth === undefined) {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    const [header, body] = auth.split(' ');
    if (header !== 'Basic') {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    const decodedBody = Buffer.from(body, 'base64').toString('utf-8');
    const [login, password] = decodedBody.split(':');
    if (login !== exports.ADMIN_USERNAME || password !== exports.ADMIN_PASSWORD) {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    next();
}
