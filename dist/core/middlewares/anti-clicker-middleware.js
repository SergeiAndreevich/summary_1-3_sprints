"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitModel = void 0;
exports.isRequestAllowed = isRequestAllowed;
exports.antiClicker = antiClicker;
const mongoose_1 = __importDefault(require("mongoose"));
const httpStatuses_1 = require("../../settings/types/httpStatuses");
const WINDOW_SECONDS = 10;
const MAX_REQUESTS = 5;
const RateLimitSchema = new mongoose_1.default.Schema({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
});
RateLimitSchema.index({ createdAt: 1 }, { expireAfterSeconds: WINDOW_SECONDS });
exports.RateLimitModel = mongoose_1.default.model('RateLimit', RateLimitSchema);
async function isRequestAllowed(IP, endpoint) {
    const count = await exports.RateLimitModel.countDocuments({ IP, URL: endpoint });
    if (count >= MAX_REQUESTS) {
        return false;
    }
    await exports.RateLimitModel.insertOne({ IP, URL: endpoint, createdAt: Date.now() });
    return true;
}
async function antiClicker(req, res, next) {
    const IP = req.ip || req.socket.remoteAddress || 'unknown';
    const URL = req.path;
    const allowed = await isRequestAllowed(IP, URL);
    if (!allowed) {
        res.sendStatus(httpStatuses_1.httpStatus.TooManyRequests);
        return;
    }
    next();
}
