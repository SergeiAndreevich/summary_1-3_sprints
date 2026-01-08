export type TypeSession = {
    userId: string;
    deviceId: string;
    ip:  string;
    deviceName: string;
    lastActivity: Date;
    expiresAt: Date;
    revoked: boolean;
}

export type TypeSessionView = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}