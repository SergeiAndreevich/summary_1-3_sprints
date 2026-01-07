"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelper = exports.REFRESH_TOKEN_EXPIRATION_MINUTES = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const date_fns_1 = require("date-fns");
const SECRET_KEY = process.env.SECRET_KEY || 'secret';
exports.REFRESH_TOKEN_EXPIRATION_MINUTES = 20;
exports.jwtHelper = {
    generateAccessToken(userId) {
        return (0, jsonwebtoken_1.sign)({ userId: userId }, SECRET_KEY, { expiresIn: '5m' });
    },
    verifyToken(userToken) {
        try {
            return (0, jsonwebtoken_1.verify)(userToken, SECRET_KEY);
        }
        catch (error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return null;
        }
    },
    generateRefreshToken(userId, deviceId) {
        const refreshToken = (0, jsonwebtoken_1.sign)({ userId, deviceId }, SECRET_KEY, { expiresIn: '20m' });
        return {
            token: refreshToken,
            meta: {
                deviceId,
                createdAt: new Date(),
                expiresIn: (0, date_fns_1.add)(new Date(), { minutes: exports.REFRESH_TOKEN_EXPIRATION_MINUTES })
            }
        };
    },
    verifyRefreshToken(refreshToken) {
        try {
            return (0, jsonwebtoken_1.verify)(refreshToken, SECRET_KEY);
        }
        catch (error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return null;
        }
    }
};
