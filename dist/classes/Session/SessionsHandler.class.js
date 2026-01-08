"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsHandler = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
class SessionsHandler {
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async findAllSessions(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        const sessionsList = await this.sessionsService.findAllSessions(userId);
        res.status(httpStatuses_1.httpStatus.Ok).send(sessionsList);
    }
    async closeAllSessions(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        await this.sessionsService.closeAllSessions(userId);
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async closeSpecificSessionByDeviceId(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        const deviceId = req.params.deviceId;
        const result = await this.sessionsService.closeSpecificSessionByDeviceId(userId, deviceId);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(result.status);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
}
exports.SessionsHandler = SessionsHandler;
