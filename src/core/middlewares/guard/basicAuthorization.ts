import {Request, Response, NextFunction} from "express";
import {httpStatus} from "../../../settings/types/httpStatuses";
import {bcryptHelper} from "../../helpers/bcrypt.helper";


export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';



export function basicGuard(req: Request, res: Response, next: NextFunction) {
    //Basic-авторизация это строка Basic gfsladfasj:sfhdksdfh

    const auth = req.headers.authorization;
    if (auth === ''  || auth === undefined) {
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    const [header,  body] = auth.split(' ');
    if(header !== 'Basic'){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    const decodedBody = Buffer.from(body, 'base64').toString('utf-8');
    const [login, password] = decodedBody.split(':');
    if(login !== ADMIN_USERNAME || password !== ADMIN_PASSWORD){
        res.sendStatus(httpStatus.Unauthorized);
        return
    }
    next()


}