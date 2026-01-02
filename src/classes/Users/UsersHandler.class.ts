import {Request,Response} from "express";
import {UsersService} from "./UsersService.class";
import {QueryRepo} from "../QueryRepo.class";
import {TypeUserInput} from "../../settings/types/user.types";
import {httpStatus} from "../../settings/types/httpStatuses";
import {paginationHelper} from "../../core/helpers/pagination.helper";
import {IPAginationAndSorting} from "../../settings/types/pagination.types";

export class UserHandler {
    constructor(protected usersService: UsersService,
                protected queryRepo: QueryRepo) {}
    async createUser(req: Request, res: Response) {
        const userInput:TypeUserInput = req.body;
        const result = await this.usersService.createUser(userInput);
        if(result.status !== httpStatus.Created){
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        res.status(httpStatus.Created).send(result.data);
    }
    async getAllUsers(req: Request, res: Response) {
        const query:Partial<IPAginationAndSorting> = req.query;
        const paginationFilter = paginationHelper(query);
        const usersList = await this.queryRepo.findUsersByFilter(paginationFilter);
        res.status(httpStatus.Ok).send(usersList)
    }
    async deleteSpecificUserById(req: Request, res: Response) {
        const userId = req.params.id;
        const result = await this.usersService.deleteSpecificUser(userId);
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent);
    }
}