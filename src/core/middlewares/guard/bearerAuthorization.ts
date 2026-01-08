import {Request, Response, NextFunction} from "express";
import {httpStatus} from "../../../settings/types/httpStatuses";
import {jwtHelper} from "../../helpers/jwt.helper";

// Расширяем интерфейс Request, чтобы добавить свойство userId
declare global {
    namespace Express {
        interface Request {
            userId?:  string // Знак вопроса делает свойство необязательным
            deviceId?: string
        }
    }
}


export async function bearerGuard(req: Request, res: Response, next: NextFunction) {
        //проверяем, пришел ли токен
        const userAuth = req.headers.authorization;
        if(!userAuth) {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }

        //если пришло что-то в headers, надо это оттуда достать
        const [authType, token] = userAuth.split(' ');
        //проверяем, какая это авторизация. Нам нужна именно bearer, другая идет лесом
        //если не токен-авторизация, то не выдадим доступ
        if(authType !== 'Bearer') {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        //если не извлекся токен
        if (!token){
            res.sendStatus(httpStatus.Unauthorized)
            return
        }


        const payload = jwtHelper.verifyToken(token);
        if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
            res.sendStatus(httpStatus.Unauthorized);
            return
        }
        req.userId = payload.userId;
        req.deviceId = payload.deviceId;
        next()
}

export function optionalBearerGuard(req: Request, res: Response, next: NextFunction) {
    //проверяем, пришел ли токен
    const userAuth = req.headers.authorization;
    if(!userAuth) {
        return next()
    }
    return bearerGuard(req,res, next)
}
