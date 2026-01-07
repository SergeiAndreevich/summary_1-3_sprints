"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const bcrypt_helper_1 = require("../../core/helpers/bcrypt.helper");
const jwt_helper_1 = require("../../core/helpers/jwt.helper");
const Session_class_1 = require("../../core/fabric/Session.class");
class AuthService {
    constructor(authRepo, sessionsRepo) {
        this.authRepo = authRepo;
        this.sessionsRepo = sessionsRepo;
    }
    async recoveryPassword(email) {
        //отдаем в repository и если такой есть, то отправляем туда код
        const confirmationCode = (0, uuid_1.v4)();
        const isUpdated = await this.authRepo.recoveryPassword(email, confirmationCode);
        if (!isUpdated) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'database', message: 'not found or wrong update!' } };
        }
        //отправляем письмо на почту для подтверждения
        //await nodemailerHelper.sendPasswordRecoveryCode(email, confirmationCode);
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async setNewPassword(newPassword, recoveryCode) {
        const newPasswordHash = await bcrypt_helper_1.bcryptHelper.generateHash(newPassword);
        const isUpdated = await this.authRepo.setNewPassword(newPasswordHash, recoveryCode);
        if (isUpdated) {
            return { data: null, status: httpStatuses_1.httpStatus.NoContent };
        }
        return { data: null, status: httpStatuses_1.httpStatus.BadRequest };
    }
    async updateRefreshToken(refreshToken) {
        //раскукоживаем рефреш-токен и получаем оттуда данные
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return { data: null, status: httpStatuses_1.httpStatus.Unauthorized };
        }
        const userId = decodedRefresh.userId;
        const deviceId = decodedRefresh.deviceId;
        //получаем актуальную сессию
        const session = await this.sessionsRepo.findSession(userId, deviceId);
        if (!session) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'database', message: 'not found' } };
        }
        //проверяем, не истёк ли токен (сравниваем корректно)
        const now = new Date();
        if (session.expiresAt.getTime() < now.getTime()) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'session', message: 'expired' } };
        }
        //протухаем старый рефреш-токен точнее удаляем сессию
        const isDeleted = await this.sessionsRepo.removeSession(session._id);
        if (!isDeleted) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'database', message: 'cannot delete session' } };
        }
        //создаем новую пару аксес-рефреш
        const newAccessToken = jwt_helper_1.jwtHelper.generateAccessToken(userId);
        const newRefreshTokenWithMeta = jwt_helper_1.jwtHelper.generateRefreshToken(userId, deviceId);
        const newSession = Session_class_1.Session.create(userId, deviceId, session.ip, session.deviceName, newRefreshTokenWithMeta.meta.createdAt, newRefreshTokenWithMeta.meta.expiresIn);
        await this.sessionsRepo.createSession(newSession);
        return { data: { accessToken: newAccessToken, refreshToken: newRefreshTokenWithMeta.token }, status: httpStatuses_1.httpStatus.Ok };
    }
    async closeSession(refreshToken) {
        const decodedRefresh = jwt_helper_1.jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return { data: null, status: httpStatuses_1.httpStatus.Unauthorized, error: { field: 'refreshToken', message: 'cannot be verified' } };
        }
        const userId = decodedRefresh.userId;
        const deviceId = decodedRefresh.deviceId;
        const session = await this.sessionsRepo.findSession(userId, deviceId);
        if (!session) {
            return { data: null, status: httpStatuses_1.httpStatus.Unauthorized, error: { field: 'database', message: 'not found' } };
        }
        const isDeleted = await this.sessionsRepo.removeSession(session._id);
        if (!isDeleted) {
            return { data: null, status: httpStatuses_1.httpStatus.Unauthorized, error: { field: 'database', message: 'smth went wrong' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
}
exports.AuthService = AuthService;
