import {WithMongoId} from "../../settings/database/db_settings";
import {TypeSession, TypeSessionView} from "../../settings/types/session.types";

export function mapSessionToView(session: WithMongoId<TypeSession>):TypeSessionView{
    return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.lastActivity.toISOString(),
        deviceId: session.deviceId
    }
}