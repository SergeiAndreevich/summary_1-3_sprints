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
    async registrationResending(req:Request, res: Response) {

    }
    async loginUser(req:Request, res: Response) {

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