"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
class User {
    constructor(props) {
        this.props = props;
    }
    static create(login, email, password) {
        const userProps = {
            accountData: {
                login,
                email,
                password
            },
            emailConfirmation: {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, date_fns_1.add)(new Date(), {
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
        };
        return new User(userProps);
    }
    toDB() {
        return this.props;
    }
}
exports.User = User;
