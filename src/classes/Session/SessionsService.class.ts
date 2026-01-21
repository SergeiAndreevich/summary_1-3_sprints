import {SessionsRepo} from "./SessionsRepo.class";
import {httpStatus} from "../../settings/types/httpStatuses";
import {IResult} from "../../settings/types/resultObject";
import {QueryRepo} from "../QueryRepo.class";
import {inject, injectable} from "inversify";

@injectable()
export class SessionsService {
    constructor(@inject(QueryRepo) private queryRepo: QueryRepo,
                @inject(SessionsRepo) private sessionsRepo: SessionsRepo){}
    async findAllSessions(userId:string){
        const result = await this.sessionsRepo.findAllSessions(userId);
        return result
    }

    async closeAllSessionsBesidesCurrent(userId: string, deviceId: string){
        await this.sessionsRepo.closeAllSessionsBesidesCurrent(userId, deviceId)
        return
    }
    async closeSpecificSessionByDeviceId(userId:string, deviceId: string):Promise<IResult<null>>{
        const session = await this.queryRepo.findSessionByDeviceId(deviceId);
        if(!session){
            return {data: null, status: httpStatus.NotFound, error: {field: 'database', message: 'notFound'}}
        }
        const result = await this.sessionsRepo.closeSpecificSession(userId, deviceId);
        if(!result){
            return {data: null, status: httpStatus.Forbidden, error: {field: 'database', message: 'not your device'}}
        }
        return {data: null, status: httpStatus.NoContent}
    }
}