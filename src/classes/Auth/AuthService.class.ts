import {v4} from "uuid";
import {httpStatus} from "../../settings/types/httpStatuses";
import {AuthRepo} from "./AuthRepo.class";
import {bcryptHelper} from "../../core/helpers/bcrypt.helper";
import {IResult} from "../../settings/types/resultObject";
import {TypeTokens} from "../../settings/types/auth.types";
import {jwtHelper} from "../../core/helpers/jwt.helper";
import {SessionsRepo} from "../Session/SessionsRepo.class";
import {Session} from "../../core/fabric/Session.class";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(@inject(AuthRepo) private authRepo: AuthRepo,
                @inject(SessionsRepo) private sessionsRepo: SessionsRepo){}
    async recoveryPassword(email:string) {
        //отдаем в repository и если такой есть, то отправляем туда код
        const confirmationCode = v4();
        const isUpdated = await this.authRepo.recoveryPassword(email, confirmationCode);
        if(!isUpdated){
            return {data: null, status: httpStatus.NotFound, error: {field: 'database',  message: 'not found or wrong update!'}}
        }
        //отправляем письмо на почту для подтверждения
        //await nodemailerHelper.sendPasswordRecoveryCode(email, confirmationCode);
        return { data: null, status: httpStatus.NoContent}
    }
    async setNewPassword(newPassword: string, recoveryCode: string){
        const newPasswordHash = await bcryptHelper.generateHash(newPassword);
        const isUpdated = await this.authRepo.setNewPassword(newPasswordHash, recoveryCode);
        if(isUpdated){
            return {data: null, status: httpStatus.NoContent}
        }
        return { data: null, status: httpStatus.BadRequest}
    }

    async updateRefreshToken(refreshToken: string):Promise<IResult<null | TypeTokens>>{
        //раскукоживаем рефреш-токен и получаем оттуда данные
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            return {data:null, status:httpStatus.Unauthorized}
        }
        const userId = decodedRefresh.userId;
        const deviceId = decodedRefresh.deviceId;
        //получаем актуальную сессию
        const session = await this.sessionsRepo.findSession(userId,deviceId)
        if(!session) {
            return {data: null, status: httpStatus.NotFound, error:  {field: 'database',  message: 'not found'}}
        }
        //проверяем, не истёк ли токен (сравниваем корректно)
        const now = new Date();
        if (session.expiresAt.getTime() < now.getTime()) {
            return {data: null, status: httpStatus.NotFound, error:  {field: 'session',  message: 'expired'}}
        }
        //протухаем старый рефреш-токен точнее удаляем сессию
        const isDeleted = await this.sessionsRepo.removeSession(session._id);
        if(!isDeleted){
            return  {data: null, status: httpStatus.NotFound, error:  {field: 'database',  message: 'cannot delete session'}}
        }
        //создаем новую пару аксес-рефреш
        const newAccessToken = jwtHelper.generateAccessToken(userId);
        const newRefreshTokenWithMeta = jwtHelper.generateRefreshToken(userId, deviceId);
        const newSession = Session.create(
                userId,deviceId,session.ip,session.deviceName,
                newRefreshTokenWithMeta.meta.createdAt, newRefreshTokenWithMeta.meta.expiresIn
        )
        await this.sessionsRepo.createSession(newSession);
        return {data: {accessToken: newAccessToken, refreshToken: newRefreshTokenWithMeta.token}, status: httpStatus.Ok}
    }

    async closeSession(refreshToken: string): Promise<IResult<null>> {
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh) {
            return  {data: null, status: httpStatus.Unauthorized, error:  {field: 'refreshToken',  message: 'cannot be verified'}}
        }
        const userId = decodedRefresh.userId;
        const deviceId = decodedRefresh.deviceId;
        const session = await this.sessionsRepo.findSession(userId, deviceId);
        if(!session) {
            return  {data: null, status: httpStatus.Unauthorized, error:  {field: 'database',  message: 'not found'}}
        }
        const isDeleted = await this.sessionsRepo.removeSession(session._id);
        if(!isDeleted){
            return  {data: null, status: httpStatus.Unauthorized, error:  {field: 'database',  message: 'smth went wrong'}}
        }
        return {data:null, status: httpStatus.NoContent}
    }

}