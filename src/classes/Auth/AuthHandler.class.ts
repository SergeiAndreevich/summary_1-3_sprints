import {TypeRegistrationInput} from "../../settings/types/auth.types";
import {httpStatus} from "../../settings/types/httpStatuses";
import {Request, Response} from "express";
import {UsersService} from "../Users/UsersService.class";
import {IResult} from "../../settings/types/resultObject";

export class Auth {
    constructor(protected usersService: UsersService){}
    async registerNewUser(req:Request, res: Response) {
        const inputData:TypeRegistrationInput = req.body; //пришли данные для создания юзера
        const result = await this.usersService.createUser(inputData); //создаем юзера
        //результат работы по созданию юзера (alreadyExist, extraError, etc)
        if(result.status !== httpStatus.NoContent){
            res.status(result.status).send(result.error);
        }
        res.sendStatus(httpStatus.NoContent)
    }
    async registrationConfirmation(req:Request, res: Response) {
        const code = req.body;
        const result:IResult<null> = await this.usersService.confirmEmailByCode(code);
        if(result.status !== httpStatus.NoContent){
            res.status(result.status).send(result.error);
        }
        res.sendStatus(httpStatus.NoContent)

    }
    async resendEmailConfirmationCode(req:Request, res: Response) {
        const email = req.body;
        const result: IResult = await this.usersService.resendEmailConfirmationCode(email);
        if(result.status !== httpStatus.NoContent){
            res.status(result.status).send(result.error);
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
        if(result.status !== httpStatus.Ok){
            res.status(httpStatus.Unauthorized).send(result.error);
        }
        res.status(httpStatus.Ok).send()
    }
    async recoveryPassword(req:Request, res: Response) {

    }
    async setNewPassword(req:Request, res: Response) {

    }
    async refreshAccess(req:Request, res: Response){

    }
    async logoutUser(req:Request, res: Response){

    }
    async getMyInfo(req:Request, res: Response){

    }
}