import {TypeRegistrationInput} from "../../settings/types/auth.types";
import {IResult} from "../../settings/types/resultObject";
import {httpStatus} from "../../settings/types/httpStatuses";
import {QueryRepo} from "../QueryRepo.class";
import {bcryptHelper} from "../../core/helpers/bcrypt.helper";
import {UsersRepo} from "./UsersRepo.class";
import {jwtHelper} from "../../core/helpers/jwt.helper";
import {Session} from "../../core/fabric/Session.class";
import {SessionsRepo} from "../Session/SessionsRepo.class";
import {TypeUserFrontView} from "../../settings/types/user.types";

export class UsersService {
    constructor(private queryRepo: QueryRepo,
                private usersRepo: UsersRepo,
                private sessionsRepo: SessionsRepo){}
    async createUser(dto:TypeRegistrationInput):Promise<IResult<TypeUserFrontView | null>>{
        const userByLoginOrEmail = await this.queryRepo.findUserByLoginOrEmail(dto.login, dto.email);
        if(userByLoginOrEmail) {
            return {data: null, status: httpStatus.Forbidden, error: {field: 'input',message: 'This user already exists'}}
        }
        const passwordHash = await bcryptHelper.generateHash(dto.password);
        const userForView = await this.usersRepo.createUser(dto.login, dto.email, passwordHash);
        if(!userForView){
            return {data: null, status: httpStatus.ExtraError,error: {field: 'database',message: 'User not created'}}
        }
        //отправить сообщение с кодом подтверждения
        return {data: userForView, status: httpStatus.NoContent}
    }

    async deleteSpecificUser(userId:string){
        const user = await this.usersRepo.deleteSpecificUser(userId);
        if(!user){
            return {data: null, status: httpStatus.NotFound, error: {field: 'userId',message: 'User not found'}}
        }
        return {data: null,  status: httpStatus.NoContent}
    }

    async confirmEmailByCode(confirmationCode: string):Promise<IResult<null>>{
        const user = await this.usersRepo.findUserByConfirmationCode(confirmationCode);
        if(!user){
            return {data: null, status: httpStatus.NotFound, error: {field: 'code',message: 'This user does not exist'}}
        }
        if(user &&
            user.emailConfirmation.isConfirmed === false &&
            user.emailConfirmation.expirationDate > new Date()) {
            const isConfirmed = await this.usersRepo.confirmEmail(user.id);
            if(!isConfirmed){
                return {data: null, status: httpStatus.ExtraError, error: {field: 'database',message: 'update problem'}}
            }
            return {data: null, status: httpStatus.NoContent}
        }
        return {data: null, status: httpStatus.BadRequest, error: {field: 'code',message: 'Code is already confirmed or expired'}}
    }
    async resendEmailConfirmationCode(email: string):Promise<IResult<null>>{
        const user = await this.usersRepo.findUserByEmail(email);
        if(!user ||  user.emailConfirmation.isConfirmed) {
            return {data: null, status: httpStatus.BadRequest, error: {field: 'email',message: 'No user or email is already confirmed'}}
        }
        await this.usersRepo.confirmEmail(user.id);
        return {data: null, status: httpStatus.NoContent}
    }

    async loginUser(loginOrEmail: string, password: string, ip:string, deviceName:string): Promise<IResult<{accessToken:string,refreshToken:string } | null>> {
        //ищем юзера
        const user = await this.usersRepo.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);
        if(!user) {
            return {data: null, status: httpStatus.NotFound, error: {field: 'inputData',message: 'User does not exist'}}
        }
        //проверяем пароль
        const isPasswordCorrect = await bcryptHelper.comparePassword(password,user.accountData.password);
        if(!isPasswordCorrect) {
            return {data: null, status: httpStatus.Unauthorized, error: {field: 'inputData',message: 'Incorrect password'}}
        }
        //создаем аксес рефреш токены, создаем сессию и возвращаем токен
        const accessToken = await jwtHelper.generateAccessToken(user.id);
        const {refreshToken, deviceId} = await jwtHelper.generateRefreshToken(user.id);

        //раскукоживаем payload (в payload сидит userId, jti, iat, exp = iat + expiresIn)
        const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);
        if(!decodedRefresh){
            return {data:null, status: httpStatus.ExtraError}
        }
        const session = Session.create(
            user.id,deviceId,ip,deviceName, new Date(decodedRefresh.iat!*1000), new Date(decodedRefresh.exp!*1000)
        )
        await this.sessionsRepo.createSession(session.toDb());
        return  {data: {accessToken,refreshToken }, status: httpStatus.Ok}
    }
}