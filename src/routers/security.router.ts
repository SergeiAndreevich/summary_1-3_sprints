import {Router} from "express";
import {bearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";
import {SessionsService} from "../classes/Session/SessionsService.class";
import {SessionsHandler} from "../classes/Session/SessionsHandler.class";
import {deviceIdValidation} from "../core/middlewares/sessionsValidators/deviceId.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {QueryRepo} from "../classes/QueryRepo.class";
import {container} from "../composition-root";

export const securityRouter = Router({});
const sessionsHandler = container.get(SessionsHandler);

securityRouter
    .get('/devices', bearerGuard, sessionsHandler.findAllSessions.bind(sessionsHandler))
    .delete('/devices', bearerGuard, sessionsHandler.closeAllSessionsBesidesCurrent.bind(sessionsHandler))
    .delete('/devices/:deviceId', bearerGuard, deviceIdValidation, checkValidationErrors, sessionsHandler.closeSpecificSessionByDeviceId.bind(sessionsHandler))