"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsRepo = void 0;
const SessionModel_mongoose_1 = require("../../settings/database/SessionModel.mongoose");
const mapSessionToView_mapper_1 = require("../../core/mappers/mapSessionToView.mapper");
class SessionsRepo {
    async createSession(session) {
        await SessionModel_mongoose_1.SessionModel.create(session.toDb());
        return;
    }
    async findSession(userId, deviceId) {
        const session = await SessionModel_mongoose_1.SessionModel.findOne({ userId: userId, deviceId: deviceId, revoked: false }).lean();
        if (!session) {
            return null;
        }
        return session;
    }
    async findAllSessions(userId) {
        const sessions = await SessionModel_mongoose_1.SessionModel.find({ userId: userId, revoked: false }).lean();
        return sessions.map(s => (0, mapSessionToView_mapper_1.mapSessionToView)(s));
    }
    async removeSession(sessionId) {
        const session = await SessionModel_mongoose_1.SessionModel.findByIdAndDelete(sessionId).lean();
        return session;
    }
    async closeAllSessionsBesidesCurrent(userId, deviceId) {
        await SessionModel_mongoose_1.SessionModel.deleteMany({ userId: userId, deviceId: { $ne: deviceId } });
        return;
    }
    async closeSpecificSession(userId, deviceId) {
        const session = await this.findSession(userId, deviceId);
        if (!session) {
            return null;
        }
        await this.removeSession(session._id);
        return session;
    }
}
exports.SessionsRepo = SessionsRepo;
