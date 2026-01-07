"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsRepo = void 0;
const SessionModel_mongoose_1 = require("../../settings/database/SessionModel.mongoose");
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
    async removeSession(sessionId) {
        const session = await SessionModel_mongoose_1.SessionModel.findByIdAndDelete(sessionId).lean();
        return session;
    }
}
exports.SessionsRepo = SessionsRepo;
