import {TypeDBUser} from "../../settings/types/user.types";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";


export class User {
    constructor(private props: TypeDBUser) {}

    static create(login: string, email: string, password: string): User {
        const userProps:TypeDBUser = {
            accountData: {
                login,
                email,
                password
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),{
                    hours: 1,
                    minutes: 2,
                }),
                isConfirmed: false
            },
            passwordRecovery: {
                confirmationCode: null,
                expirationDate: new Date(),
                isConfirmed: false
            }
        }
        return new User(userProps)
    }
    toDB(): TypeDBUser{
      return this.props
    }
}
