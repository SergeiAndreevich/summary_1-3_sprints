"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const bcrypt_helper_1 = require("../../core/helpers/bcrypt.helper");
const jwt_helper_1 = require("../../core/helpers/jwt.helper");
const Session_class_1 = require("../../core/fabric/Session.class");
const User_class_1 = require("../../core/fabric/User.class");
const uuid_1 = require("uuid");
class UsersService {
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
}
exports.UsersService = UsersService;
