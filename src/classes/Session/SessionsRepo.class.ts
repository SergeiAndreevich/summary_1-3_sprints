import {SessionModel} from "../../settings/database/SessionModel.mongoose";
import {Session} from "../../core/fabric/Session.class";
import {WithMongoId} from "../../settings/database/db_settings";
import {TypeSession} from "../../settings/types/session.types";
import {ObjectId} from "mongodb";

export class SessionsRepo {
    async createSession(session: Session) {
        await SessionModel.create(session.toDb());
        return
    }
    async findSession(userId:string,deviceId:string){
        const session = await SessionModel.findOne({userId: userId,deviceId: deviceId, revoked: false}).lean<WithMongoId<TypeSession>>();
        if(!session) {
            return null
        }
        return session
    }
    async removeSession(sessionId: ObjectId){
        const session = await SessionModel.findByIdAndDelete(sessionId).lean<WithMongoId<TypeSession>>()
        return session
    }
}