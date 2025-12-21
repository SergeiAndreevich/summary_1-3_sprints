import {TypeSession} from "../../settings/types/session.types";

export class Session {
    constructor(private props: TypeSession) {}
    static create(userId: string, deviceId:string, ip:string,deviceName:string,
                  lastActivity: Date, expiresAt:Date) {
        const props = {
            userId:userId,
            deviceId:deviceId,
            ip:ip,
            deviceName:deviceName,
            lastActivity: lastActivity,
            expiresAt: expiresAt,
            revoked: false
        }
        return new Session(props);
    }
    toDb() {
        return this.props
    }
}