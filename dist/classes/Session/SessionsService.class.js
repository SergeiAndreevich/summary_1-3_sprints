"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
class SessionsService {
    constructor(queryRepo, sessionsRepo) {
        this.queryRepo = queryRepo;
        this.sessionsRepo = sessionsRepo;
    }
    async findAllSessions(userId) {
        const result = await this.sessionsRepo.findAllSessions(userId);
        return result;
    }
    async closeAllSessionsBesidesCurrent(userId, deviceId) {
        await this.sessionsRepo.closeAllSessionsBesidesCurrent(userId, deviceId);
        return;
    }
    async closeSpecificSessionByDeviceId(userId, deviceId) {
        const session = await this.queryRepo.findSessionByDeviceId(deviceId);
        if (!session) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'database', message: 'notFound' } };
        }
        const result = await this.sessionsRepo.closeSpecificSession(userId, deviceId);
        if (!result) {
            return { data: null, status: httpStatuses_1.httpStatus.Forbidden, error: { field: 'database', message: 'not your device' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
}
exports.SessionsService = SessionsService;
