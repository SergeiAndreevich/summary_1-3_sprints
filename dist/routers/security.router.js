"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const SessionsHandler_class_1 = require("../classes/Session/SessionsHandler.class");
const deviceId_validation_1 = require("../core/middlewares/sessionsValidators/deviceId.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
const composition_root_1 = require("../composition-root");
exports.securityRouter = (0, express_1.Router)({});
const sessionsHandler = composition_root_1.container.get(SessionsHandler_class_1.SessionsHandler);
exports.securityRouter
    .get('/devices', bearerAuthorization_1.bearerGuard, sessionsHandler.findAllSessions.bind(sessionsHandler))
    .delete('/devices', bearerAuthorization_1.bearerGuard, sessionsHandler.closeAllSessionsBesidesCurrent.bind(sessionsHandler))
    .delete('/devices/:deviceId', bearerAuthorization_1.bearerGuard, deviceId_validation_1.deviceIdValidation, errors_middleware_1.checkValidationErrors, sessionsHandler.closeSpecificSessionByDeviceId.bind(sessionsHandler));
