"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsRepo = void 0;
const SessionModel_mongoose_1 = require("../../settings/database/SessionModel.mongoose");
const mapSessionToView_mapper_1 = require("../../core/mappers/mapSessionToView.mapper");
const inversify_1 = require("inversify");
let SessionsRepo = class SessionsRepo {
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
};
exports.SessionsRepo = SessionsRepo;
exports.SessionsRepo = SessionsRepo = __decorate([
    (0, inversify_1.injectable)()
], SessionsRepo);
