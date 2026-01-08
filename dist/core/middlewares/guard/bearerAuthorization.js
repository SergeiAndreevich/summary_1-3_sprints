"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bearerGuard = bearerGuard;
exports.optionalBearerGuard = optionalBearerGuard;
const httpStatuses_1 = require("../../../settings/types/httpStatuses");
const jwt_helper_1 = require("../../helpers/jwt.helper");
async function bearerGuard(req, res, next) {
    //проверяем, пришел ли токен
    const userAuth = req.headers.authorization;
    if (!userAuth) {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    //если пришло что-то в headers, надо это оттуда достать
    const [authType, token] = userAuth.split(' ');
    //проверяем, какая это авторизация. Нам нужна именно bearer, другая идет лесом
    //если не токен-авторизация, то не выдадим доступ
    if (authType !== 'Bearer') {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    //если не извлекся токен
    if (!token) {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    const payload = jwt_helper_1.jwtHelper.verifyToken(token);
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
        return;
    }
    req.userId = payload.userId;
    req.deviceId = payload.deviceId;
    next();
}
function optionalBearerGuard(req, res, next) {
    //проверяем, пришел ли токен
    const userAuth = req.headers.authorization;
    if (!userAuth) {
        return next();
    }
    return bearerGuard(req, res, next);
}
