import {SessionModel} from "../../settings/database/SessionModel.mongoose";
import {Session} from "../../core/fabric/Session.class";
import {WithMongoId} from "../../settings/database/db_settings";
import {TypeSession} from "../../settings/types/session.types";
import {ObjectId} from "mongodb";
import {mapSessionToView} from "../../core/mappers/mapSessionToView.mapper";

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
    async findAllSessions(userId: string){
        const sessions = await SessionModel.find({userId: userId, revoked: false}).lean<WithMongoId<TypeSession>[]>();
        return sessions.map(s => mapSessionToView(s))
    }

    async removeSession(sessionId: ObjectId){
        const session = await SessionModel.findByIdAndDelete(sessionId).lean<WithMongoId<TypeSession>>()
        return session
    }
    async closeAllSessionsBesidesCurrent(userId: string, deviceId: string){
        await SessionModel.deleteMany({userId:userId, deviceId: { $ne: deviceId }})
        return
    }
    async closeSpecificSession(userId: string, deviceId:string){
        const session = await this.findSession(userId, deviceId);
        if(!session){
            return null
        }
        await this.removeSession(session._id)
        return session
    }
}