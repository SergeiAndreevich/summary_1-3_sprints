"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const httpStatuses_1 = require("../../settings/types/httpStatuses");
class Auth {
    constructor(usersService, authService, queryRepo) {
        this.usersService = usersService;
        this.authService = authService;
        this.queryRepo = queryRepo;
    }
    async registerNewUser(req, res) {
        const inputData = req.body; //пришли данные для создания юзера
        const result = await this.usersService.createUser(inputData); //создаем юзера
        //результат работы по созданию юзера (alreadyExist, extraError, etc)
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.status(result.status).send(result.error);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async registrationConfirmation(req, res) {
        const code = req.body.code;
        const result = await this.usersService.confirmEmailByCode(code);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.status(result.status).send(result.error);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async resendEmailConfirmationCode(req, res) {
        const email = req.body;
        const result = await this.usersService.resendEmailConfirmationCode(email);
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.status(result.status).send(result.error);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async recoveryPassword(req, res) {
        //получаем email
        const email = req.body.email;
        //отдаем его в сервис и говорим "отправь код восстановления пароля"
        const result = await this.authService.recoveryPassword(email);
        //в любом случае отправляем 204, чтоб не палить email
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async setNewPassword(req, res) {
        //забираем данные из боди
        const input = req.body;
        //отдаем в сервис и говорим "обнови"
        const result = await this.authService.setNewPassword(input.newPassword, input.recoveryCode);
        //получаем результат
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.status(httpStatuses_1.httpStatus.BadRequest);
            return;
        }
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async loginUser(req, res) {
        const { loginOrEmail, password } = req.body;
        const ip = req.ip;
        if (!ip) {
            res.sendStatus(httpStatuses_1.httpStatus.Forbidden);
            return;
        }
        const deviceName = req.headers['user-agent'] || 'Unknown device';
        const result = await this.usersService.loginUser(loginOrEmail, password, ip, deviceName);
        switch (result.status) {
            case httpStatuses_1.httpStatus.NotFound:
                res.sendStatus(httpStatuses_1.httpStatus.NotFound);
                break;
            case httpStatuses_1.httpStatus.Unauthorized:
                res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
                break;
            case httpStatuses_1.httpStatus.Ok:
                res.cookie("refreshToken", result.data.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 20 * 60 * 1000 // 20 минут в ms
                });
                res.status(httpStatuses_1.httpStatus.Ok).send({ accessToken: result.data.accessToken });
                break;
            default:
                res.sendStatus(httpStatuses_1.httpStatus.InternalServerError);
                break;
        }
    }
    async refreshAccess(req, res) {
        //проверяем,пришел ли в куки рефреш-токен
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        // ВАЖНО: Сначала проверяем валидность токена
        //ищем, обновляем пару
        const result = await this.authService.updateRefreshToken(refreshToken);
        if (result.status !== httpStatuses_1.httpStatus.Ok) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        //отправляем пользователю
        res.cookie("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 20 * 60 * 1000 // 20 минут в ms
        });
        res.status(httpStatuses_1.httpStatus.Ok).send({ accessToken: result.data.accessToken });
    }
    async logoutUser(req, res) {
        // check actual token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        // вносим изменения в БД, т.е. протухаем существующий токен
        const result = await this.authService.closeSession(refreshToken);
        //проверяем статус того че пришло из БД
        if (result.status !== httpStatuses_1.httpStatus.NoContent) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        //очищаем куки и возвращаем ответочку
        res.clearCookie("refreshToken");
        res.sendStatus(httpStatuses_1.httpStatus.NoContent);
    }
    async getMyInfo(req, res) {
        const userId = req.userId;
        if (userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatuses_1.httpStatus.Unauthorized);
            return;
        }
        const user = await this.queryRepo.findUserById(userId);
        if (!user) {
            res.sendStatus(httpStatuses_1.httpStatus.ExtraError);
            return;
        }
        res.status(httpStatuses_1.httpStatus.Ok).send({ email: user.email, login: user.login, userId: user.id });
    }
}
exports.Auth = Auth;
