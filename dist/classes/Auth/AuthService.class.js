"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const AuthRepo_class_1 = require("./AuthRepo.class");
const bcrypt_helper_1 = require("../../core/helpers/bcrypt.helper");
const jwt_helper_1 = require("../../core/helpers/jwt.helper");
const SessionsRepo_class_1 = require("../Session/SessionsRepo.class");
const Session_class_1 = require("../../core/fabric/Session.class");
const inversify_1 = require("inversify");
let AuthService = class AuthService {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(AuthRepo_class_1.AuthRepo)),
    __param(1, (0, inversify_1.inject)(SessionsRepo_class_1.SessionsRepo)),
    __metadata("design:paramtypes", [AuthRepo_class_1.AuthRepo,
        SessionsRepo_class_1.SessionsRepo])
], AuthService);
