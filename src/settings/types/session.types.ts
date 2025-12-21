export type TypeSession = {
    userId: string;
    deviceId: string;
    ip:  string;
    deviceName: string;
    lastActivity: Date;
    expiresAt: Date;
    revoked: boolean;
}