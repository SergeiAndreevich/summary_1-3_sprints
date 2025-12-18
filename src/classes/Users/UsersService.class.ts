import {TypeRegistrationInput} from "../../settings/types/auth.types";
import {IResult} from "../../settings/types/resultObject";
import {httpStatus} from "../../settings/types/httpStatuses";
import {QueryRepo} from "../QueryRepo.class";
import bcrypt from "bcrypt";
import {bcryptHelper} from "../../core/helpers/bcrypt.helper";
import {UsersRepo} from "./UsersRepo.class";

export class UsersService {
    constructor(private queryRepo: QueryRepo,
                private usersRepo: UsersRepo){}
    async createUser(dto:TypeRegistrationInput):Promise<IResult<null | string>>{
        const userByLoginOrEmail = await this.queryRepo.findUserByLoginOrEmail(dto.login, dto.email);
        if(userByLoginOrEmail) {
            return {data: null, status: httpStatus.Forbidden, error: {field: 'input',message: 'This user already exists'}}
        }
        const passwordHash = await bcryptHelper.generateHash(dto.password);
        await this.usersRepo.createUser(dto.login, dto.email, passwordHash);

        return {data: null, status: httpStatus.NoContent}
    }
    async confirmEmailByCode(confirmationCode: string){
        const user = await this.queryRepo.findUserByConfirmationCode(confirmationCode);
        if(!user){
            return {data: null, status: httpStatus.NotFound, error: {field: 'code',message: 'This user does not exist'}}
        }
        if(user &&
            user.emailConfirmation.isConfirmed === false &&
            user.emailConfirmation.expirationDate > new Date()) {
            await this.usersRepo.confirmEmail(user.id);
            return {data: null, status: httpStatus.NoContent}
        }
        return {data: null, status: httpStatus.BadRequest, error: {field: 'code',message: 'Code is already confirmed or expired'}}

    }
}