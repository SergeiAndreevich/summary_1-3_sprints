import {TypeRegistrationInput} from "../../settings/types/auth.types";
import {httpStatus} from "../../settings/types/httpStatuses";
import {Request, Response} from "express";
import {UsersService} from "../Users/UsersService.class";
import {IResult} from "../../settings/types/resultObject";
import {AuthService} from "./AuthService.class";

export class Auth {
    constructor(protected usersService: UsersService,
                protected authService: AuthService){}
    async registerNewUser(req:Request, res: Response) {
        const inputData:TypeRegistrationInput = req.body; //пришли данные для создания юзера
        const result = await this.usersService.createUser(inputData); //создаем юзера
        //результат работы по созданию юзера (alreadyExist, extraError, etc)
        if(result.status !== httpStatus.NoContent){
            res.status(result.status).send(result.error);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }

    async registrationConfirmation(req:Request, res: Response) {
        const code = req.body;
        const result:IResult<null> = await this.usersService.confirmEmailByCode(code);
        if(result.status !== httpStatus.NoContent){
            res.status(result.status).send(result.error);
            return
        }
        res.sendStatus(httpStatus.NoContent)

    }
    async resendEmailConfirmationCode(req:Request, res: Response) {
        const email = req.body;
        const result: IResult = await this.usersService.resendEmailConfirmationCode(email);
        if(result.status !== httpStatus.NoContent){
            res.status(result.status).send(result.error);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }

    async loginUser(req:Request, res: Response) {
        const {loginOrEmail, password} = req.body;
        const ip = req.ip;
        if(!ip){
            res.sendStatus(httpStatus.Forbidden);
            return
        }
        const deviceName = req.headers['user-agent']  || 'Unknown device';
        const result = await this.usersService.loginUser(loginOrEmail, password, ip, deviceName);
        switch (result.status) {
            case httpStatus.NotFound:
                res.sendStatus(httpStatus.NotFound);
                break
            case httpStatus.Unauthorized:
                res.sendStatus(httpStatus.Unauthorized);
                break
            case httpStatus.Ok:
                res.cookie("refreshToken", result.data!.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 20* 60 * 1000 // 20 минут в ms
                });
                res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken});
                break
            default:
                res.sendStatus(httpStatus.InternalServerError)
                break
        }
    }

    async recoveryPassword(req:Request, res: Response) {
        //получаем email
        const email = req.body.email;
        //отдаем его в сервис и говорим "отправь код восстановления пароля"
        const result = await this.authService.recoveryPassword(email);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(httpStatus.ExtraError);
            return
        }
        //успешно? отправляем 204
        res.sendStatus(httpStatus.NoContent)
    }
    async setNewPassword(req:Request, res: Response) {
        //забираем данные из боди
        const input = req.body;
        //отдаем в сервис и говорим "обнови"
        const result = await this.authService.setNewPassword(input.recoveryCode,input.newPassword);
        //получаем результат
        if(result.status !== ResultStatuses.success) {
            res.status(httpStatus.BadRequest).send(createErrorsMessages(result.errorMessage!));
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }

    async refreshAccess(req:Request, res: Response){
        //проверяем,пришел ли в куки рефреш-токен
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        // ВАЖНО: Сначала проверяем валидность токена
        //ищем, обновляем пару
        const result = await this.authService.updateRefreshToken(refreshToken);
        if(result.status !== ResultStatuses.success){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        //отправляем пользователю
        res.cookie("refreshToken", result.data!.refreshToken, {
            httpOnly: true,
            secure: true,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 20 * 60 * 1000 // 20 минут в ms
        });
        res.status(httpStatus.Ok).send({accessToken: result.data!.accessToken})
    }

    async logoutUser(req:Request, res: Response){
        // check actual token
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        // вносим изменения в БД, т.е. протухаем существующий токен
        const result = await this.authService.removeRefreshToken(refreshToken);
        //проверяем статус того че пришло из БД
        if(result.status !== ResultStatuses.success){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        //очищаем куки и возвращаем ответочку
        res.clearCookie("refreshToken");
        res.sendStatus(httpStatus.NoContent)
    }

    async getMyInfo(req:Request, res: Response){
        const userId = req.userId;
        if(userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatus.Unauthorized)
            return
        }
        const user = await this.queryRepo.findUserByIdOrFail(userId);
        if(!user){
            res.sendStatus(httpStatus.ExtraError)
            return
        }
        res.status(httpStatus.Ok).send({email:user?.email,login:user?.login,userId:user?.id})
    }
}