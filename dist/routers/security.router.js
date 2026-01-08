"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const SessionsRepo_class_1 = require("../classes/Session/SessionsRepo.class");
const SessionsService_class_1 = require("../classes/Session/SessionsService.class");
const SessionsHandler_class_1 = require("../classes/Session/SessionsHandler.class");
const deviceId_validation_1 = require("../core/middlewares/sessionsValidators/deviceId.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
const QueryRepo_class_1 = require("../classes/QueryRepo.class");
exports.securityRouter = (0, express_1.Router)({});
const queryRepo = new QueryRepo_class_1.QueryRepo();
const sessionsRepo = new SessionsRepo_class_1.SessionsRepo();
const sessionsService = new SessionsService_class_1.SessionsService(queryRepo, sessionsRepo);
const sessionsHandler = new SessionsHandler_class_1.SessionsHandler(sessionsService);
exports.securityRouter
    .get('/devices', bearerAuthorization_1.bearerGuard, sessionsHandler.findAllSessions)
    .delete('/devices', bearerAuthorization_1.bearerGuard, sessionsHandler.closeAllSessionsBesidesCurrent)
    .delete('/devices/:deviceId', bearerAuthorization_1.bearerGuard, deviceId_validation_1.deviceIdValidation, errors_middleware_1.checkValidationErrors, sessionsHandler.closeSpecificSessionByDeviceId);
