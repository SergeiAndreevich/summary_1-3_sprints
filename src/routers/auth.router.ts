import {Router} from "express";
import {Auth} from "../classes/Auth/AuthHandler.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";
import {AuthService} from "../classes/Auth/AuthService.class";
import {AuthRepo} from "../classes/Auth/AuthRepo.class";
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
    .post('/registration', antiClicker, userInputValidation, checkValidationErrors, auth.registerNewUser)
    .post('/registration-confirmation', antiClicker, codeValidation, checkValidationErrors, auth.registrationConfirmation)
    .post('/registration-email-resending',antiClicker, emailValidation, checkValidationErrors, auth.resendEmailConfirmationCode)
    .post('/login', antiClicker, inputAuthValidation, checkValidationErrors, auth.loginUser)
    .post('/password-recovery', antiClicker, emailValidation, checkValidationErrors, auth.recoveryPassword)
    .post('/new-password', antiClicker, passwordRecoveryValidation, checkValidationErrors, auth.setNewPassword)
    .post('/refresh-token', auth.refreshAccess)
    .post('/logout',auth.logoutUser)
    .get('/me', bearerGuard, auth.getMyInfo)

