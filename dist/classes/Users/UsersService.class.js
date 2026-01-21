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
exports.UsersService = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const QueryRepo_class_1 = require("../QueryRepo.class");
const bcrypt_helper_1 = require("../../core/helpers/bcrypt.helper");
const UsersRepo_class_1 = require("./UsersRepo.class");
const jwt_helper_1 = require("../../core/helpers/jwt.helper");
const Session_class_1 = require("../../core/fabric/Session.class");
const SessionsRepo_class_1 = require("../Session/SessionsRepo.class");
const User_class_1 = require("../../core/fabric/User.class");
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
let UsersService = class UsersService {
    constructor(queryRepo, usersRepo, sessionsRepo) {
        this.queryRepo = queryRepo;
        this.usersRepo = usersRepo;
        this.sessionsRepo = sessionsRepo;
    }
    async createUser(dto) {
        const userByLoginOrEmail = await this.queryRepo.findUserByLoginOrEmail(dto.login, dto.email);
        if (userByLoginOrEmail) {
            return { data: null, status: httpStatuses_1.httpStatus.Forbidden, error: { field: 'input', message: 'This user already exists' } };
        }
        const passwordHash = await bcrypt_helper_1.bcryptHelper.generateHash(dto.password);
        const user = User_class_1.User.create(dto.login, dto.email, passwordHash);
        const userForView = await this.usersRepo.createUser(user);
        if (!userForView) {
            return { data: null, status: httpStatuses_1.httpStatus.ExtraError, error: { field: 'database', message: 'User not created' } };
        }
        //отправить сообщение с кодом подтверждения
        return { data: userForView, status: httpStatuses_1.httpStatus.NoContent };
    }
    async deleteSpecificUser(userId) {
        const user = await this.usersRepo.deleteSpecificUser(userId);
        if (!user) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'userId', message: 'User not found' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async confirmEmailByCode(confirmationCode) {
        const user = await this.usersRepo.findUserByConfirmationCode(confirmationCode);
        if (!user) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'code', message: 'This user does not exist' } };
        }
        if (user &&
            user.emailConfirmation.isConfirmed === false &&
            user.emailConfirmation.expirationDate > new Date()) {
            const isConfirmed = await this.usersRepo.confirmEmail(user.id);
            if (!isConfirmed) {
                return { data: null, status: httpStatuses_1.httpStatus.ExtraError, error: { field: 'database', message: 'update problem' } };
            }
            return { data: null, status: httpStatuses_1.httpStatus.NoContent };
        }
        return { data: null, status: httpStatuses_1.httpStatus.BadRequest, error: { field: 'code', message: 'Code is already confirmed or expired' } };
    }
    async resendEmailConfirmationCode(email) {
        const user = await this.usersRepo.findUserByEmail(email);
        if (!user || user.emailConfirmation.isConfirmed) {
            return { data: null, status: httpStatuses_1.httpStatus.BadRequest, error: { field: 'email', message: 'No user or email is already confirmed' } };
        }
        const isConfirmed = await this.usersRepo.confirmEmail(user.id);
        if (!isConfirmed) {
            return { data: null, status: httpStatuses_1.httpStatus.ExtraError, error: { field: 'database', message: 'update problem' } };
        }
        return { data: null, status: httpStatuses_1.httpStatus.NoContent };
    }
    async loginUser(loginOrEmail, password, ip, deviceName) {
        //ищем юзера
        const user = await this.usersRepo.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);
        if (!user) {
            return { data: null, status: httpStatuses_1.httpStatus.NotFound, error: { field: 'inputData', message: 'User does not exist' } };
        }
        //проверяем пароль
        const isPasswordCorrect = await bcrypt_helper_1.bcryptHelper.comparePassword(password, user.accountData.password);
        if (!isPasswordCorrect) {
            return { data: null, status: httpStatuses_1.httpStatus.Unauthorized, error: { field: 'inputData', message: 'Incorrect password' } };
        }
        //создаем аксес рефреш токены, создаем сессию и возвращаем токен
        const accessToken = await jwt_helper_1.jwtHelper.generateAccessToken(user.id);
        const deviceId = (0, uuid_1.v4)();
        const refreshTokenWithMeta = await jwt_helper_1.jwtHelper.generateRefreshToken(user.id, deviceId);
        const session = Session_class_1.Session.create(user.id, deviceId, ip, deviceName, refreshTokenWithMeta.meta.createdAt, refreshTokenWithMeta.meta.expiresIn);
        await this.sessionsRepo.createSession(session);
        return { data: { accessToken, refreshToken: refreshTokenWithMeta.token }, status: httpStatuses_1.httpStatus.Ok };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(QueryRepo_class_1.QueryRepo)),
    __param(1, (0, inversify_1.inject)(UsersRepo_class_1.UsersRepo)),
    __param(2, (0, inversify_1.inject)(SessionsRepo_class_1.SessionsRepo)),
    __metadata("design:paramtypes", [QueryRepo_class_1.QueryRepo,
        UsersRepo_class_1.UsersRepo,
        SessionsRepo_class_1.SessionsRepo])
], UsersService);
