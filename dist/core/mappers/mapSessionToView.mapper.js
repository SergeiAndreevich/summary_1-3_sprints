"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSessionToView = mapSessionToView;
function mapSessionToView(session) {
    return {
        ip: session.ip,
        title: session.deviceName,
        lastActiveDate: session.lastActivity.toISOString(),
        deviceId: session.deviceId
    };
}
