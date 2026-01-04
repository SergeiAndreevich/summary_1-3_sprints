import {v4} from "uuid";
import {httpStatus} from "../../settings/types/httpStatuses";
import {AuthRepo} from "./AuthRepo.class";

export class AuthService {
    constructor(private authRepo: AuthRepo){}
    async recoveryPassword(email:string) {
        //отдаем в repository и если такой есть, то отправляем туда код
        const confirmationCode = v4();
        const result = await this.authRepo.recoveryPassword(email, confirmationCode);
        if(!result){
            return {data: null, status: httpStatus.NotFound, error: {field: 'database',  message: 'not found or wrong update!'}}
        }
        //отправляем письмо на почту для подтверждения
        //await nodemailerHelper.sendPasswordRecoveryCode(email, confirmationCode);
        return { data: null, status: httpStatus.NoContent}
    }
}