import {Router} from "express";
import {bearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";
import {SessionsService} from "../classes/Session/SessionsService.class";
import {SessionsHandler} from "../classes/Session/SessionsHandler.class";
import {deviceIdValidation} from "../core/middlewares/sessionsValidators/deviceId.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {QueryRepo} from "../classes/QueryRepo.class";

export const securityRouter = Router({});
const queryRepo = new QueryRepo();
const sessionsRepo = new SessionsRepo();
const sessionsService = new SessionsService(queryRepo,sessionsRepo);
const sessionsHandler = new SessionsHandler(sessionsService);

securityRouter
    .get('/devices', bearerGuard, sessionsHandler.findAllSessions)
    .delete('/devices', bearerGuard, sessionsHandler.closeAllSessions)
    .delete('/devices/:deviceId', bearerGuard, deviceIdValidation, checkValidationErrors, sessionsHandler.closeSpecificSessionByDeviceId)