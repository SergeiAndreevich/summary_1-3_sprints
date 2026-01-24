import {Router} from "express";
import {Auth} from "../classes/Auth/AuthHandler.class";
import {antiClicker} from "../core/middlewares/anti-clicker-middleware";
import {userInputValidation} from "../core/middlewares/userRouterValidators/userInput.validation";
import {codeValidation, emailValidation} from "../core/middlewares/userRouterValidators/emailCode.validation";
import {bearerGuard} from "../core/middlewares/guard/bearerAuthorization";
import {inputAuthValidation} from "../core/middlewares/userRouterValidators/authInput.validation";
import {passwordRecoveryValidation} from "../core/middlewares/userRouterValidators/passwordRecovery.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {container} from "../composition-root";

export const authRouter = Router({});
const auth =  container.get(Auth);

authRouter
    .post('/registration', antiClicker, userInputValidation, checkValidationErrors, auth.registerNewUser.bind(auth))
    .post('/registration-confirmation', antiClicker, codeValidation, checkValidationErrors, auth.registrationConfirmation.bind(auth))
    .post('/registration-email-resending',antiClicker, emailValidation, checkValidationErrors, auth.resendEmailConfirmationCode.bind(auth))
    .post('/login', inputAuthValidation, checkValidationErrors, auth.loginUser.bind(auth))
    .post('/password-recovery', antiClicker, emailValidation, checkValidationErrors, auth.recoveryPassword.bind(auth))
    .post('/new-password', antiClicker, passwordRecoveryValidation, checkValidationErrors, auth.setNewPassword.bind(auth))
    .post('/refresh-token', auth.refreshAccess.bind(auth))
    .post('/logout',auth.logoutUser.bind(auth))
    .get('/me', bearerGuard, auth.getMyInfo.bind(auth))

