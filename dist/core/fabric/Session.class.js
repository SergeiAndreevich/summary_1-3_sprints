"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor(props) {
        this.props = props;
    }
    static create(userId, deviceId, ip, deviceName, lastActivity, expiresAt) {
        const props = {
            userId: userId,
            deviceId: deviceId,
            ip: ip,
            deviceName: deviceName,
            lastActivity: lastActivity,
            expiresAt: expiresAt,
            revoked: false
        };
        return new Session(props);
    }
    toDb() {
        return this.props;
    }
}
exports.Session = Session;
