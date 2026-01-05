import {JwtPayload, sign, verify} from "jsonwebtoken";
import {add} from "date-fns";


const SECRET_KEY = process.env.SECRET_KEY || 'secret';
export const REFRESH_TOKEN_EXPIRATION_MINUTES = 20;
export type TypeTokenWithMeta = {
    token:string;
    meta: {
        deviceId: string;
        createdAt: Date;
        expiresIn: Date
    }
}

export const jwtHelper = {
    generateAccessToken(userId:String) {
        return sign({userId:userId}, SECRET_KEY, {expiresIn: '5m'})
    },
    verifyToken(userToken: string):string | JwtPayload | null {
        try{
            return verify(userToken, SECRET_KEY);
        }
        catch(error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return  null
        }
    },
    generateRefreshToken(userId: string, deviceId: string):TypeTokenWithMeta {
        const refreshToken = sign({userId,deviceId}, SECRET_KEY, {expiresIn: '20m'} );
        return {
            token: refreshToken,
            meta: {
                deviceId,
                createdAt: new Date(),
                expiresIn: add(new Date(), {minutes: REFRESH_TOKEN_EXPIRATION_MINUTES} )
            }
        }
        },
    verifyRefreshToken(refreshToken: string):JwtPayload | null {
        try{
            return verify(refreshToken, SECRET_KEY) as JwtPayload;        }
        catch(error) {
            console.error(`In jwt middleware has dropped an error: ${error}`);
            return  null
        }
    }
}