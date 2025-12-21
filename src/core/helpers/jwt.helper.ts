import {JwtPayload, sign, verify} from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export const jwtHelper = {
    async generateAccessToken(userId:String) {
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
    generateRefreshToken(userId: string) {
        const deviceId = uuidv4();
        const refreshToken = sign({userId:userId, deviceId: deviceId}, SECRET_KEY, {expiresIn: '20m'} );
        return {refreshToken, deviceId}
    },
    updateRefreshToken(userId: string, deviceId: string) {
        const refreshToken = sign({userId:userId, deviceId: deviceId}, SECRET_KEY, {expiresIn: '20m'} );
        return {refreshToken, deviceId}
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