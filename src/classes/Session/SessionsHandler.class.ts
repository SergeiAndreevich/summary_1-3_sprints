import {Request, Response} from "express";
import {httpStatus} from "../../settings/types/httpStatuses";
import {SessionsService} from "./SessionsService.class";
import {inject, injectable} from "inversify";

@injectable()
export class SessionsHandler {
    constructor(@inject(SessionsService) private sessionsService: SessionsService ){}
    async findAllSessions(req:Request, res: Response){
        const userId = req.userId;
        if(userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatus.Unauthorized)
            return
        }
        const sessionsList = await this.sessionsService.findAllSessions(userId);
        res.status(httpStatus.Ok).send(sessionsList)
    }

    async closeAllSessionsBesidesCurrent(req: Request, res: Response){
        const userId = req.userId;
        if(userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatus.Unauthorized)
            return
        }
        const deviceId = req.deviceId;
        if(deviceId === undefined || deviceId === null || deviceId.length === 0) {
            res.sendStatus(httpStatus.Unauthorized)
            return
        }
        await this.sessionsService.closeAllSessionsBesidesCurrent(userId, deviceId);
        res.sendStatus(httpStatus.NoContent)
    }
    async closeSpecificSessionByDeviceId(req: Request, res: Response){
        const userId = req.userId;
        if(userId === undefined || userId === null || userId.length === 0) {
            res.sendStatus(httpStatus.Unauthorized)
            return
        }
        const deviceId = req.params.deviceId;
        const result = await this.sessionsService.closeSpecificSessionByDeviceId(userId, deviceId)
        if(result.status !== httpStatus.NoContent){
            res.sendStatus(result.status);
            return
        }
        res.sendStatus(httpStatus.NoContent)
    }
}