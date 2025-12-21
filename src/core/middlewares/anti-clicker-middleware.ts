import mongoose from "mongoose";
import {NextFunction} from "express";
import {httpStatus} from "../../settings/types/httpStatuses";
import {Request, Response} from "express";

const WINDOW_SECONDS = 10;
const MAX_REQUESTS = 5;

const RateLimitSchema = new mongoose.Schema({
    IP: {type: String, required: true},
    URL: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now}
});


RateLimitSchema.index(
    {createdAt: 1},
    {expireAfterSeconds: 10}
)
export const RateLimitModel = mongoose.model('RateLimit', RateLimitSchema);

export async function isRequestAllowed(IP: string, endpoint: string): Promise<boolean> {
    const count = await RateLimitModel.countDocuments({IP, URL: endpoint});
    if(count >=MAX_REQUESTS){
        return false
    }
    await RateLimitModel.insertOne({IP, URL: endpoint, createdAt: Date.now()});
    return true
}

export async function antiClicker(req: Request, res: Response, next: NextFunction): Promise<void> {
    const IP = req.ip || req.socket.remoteAddress || 'unknown';
    const URL = req.path;
    const allowed = await isRequestAllowed(IP, URL);
    if(!allowed) {
        res.sendStatus(httpStatus.TooManyRequests)
        return
    }
    next()
}