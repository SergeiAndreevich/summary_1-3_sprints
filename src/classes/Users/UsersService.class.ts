import {TypeRegistrationInput} from "../../settings/types/auth.types";
import {IResult} from "../../settings/types/resultObject";

export class UsersService {
    async createUser(dto:TypeRegistrationInput):Promise<IResult<null | string>>{
        return
    }
}