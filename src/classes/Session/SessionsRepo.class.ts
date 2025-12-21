import {TypeSession} from "../../settings/types/session.types";
import {SessionModel} from "../../settings/database/SessionModel.mongoose";

export class SessionsRepo {
    async createSession(session: TypeSession) {
        await SessionModel.create(session)
        return
    }
}