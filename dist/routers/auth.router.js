"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const AuthHandler_class_1 = require("../classes/Auth/AuthHandler.class");
const anti_clicker_middleware_1 = require("../core/middlewares/anti-clicker-middleware");
const userInput_validation_1 = require("../core/middlewares/userRouterValidators/userInput.validation");
const emailCode_validation_1 = require("../core/middlewares/userRouterValidators/emailCode.validation");
const bearerAuthorization_1 = require("../core/middlewares/guard/bearerAuthorization");
const authInput_validation_1 = require("../core/middlewares/userRouterValidators/authInput.validation");
const passwordRecovery_validation_1 = require("../core/middlewares/userRouterValidators/passwordRecovery.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
const composition_root_1 = require("../composition-root");
exports.authRouter = (0, express_1.Router)({});
const auth = composition_root_1.container.get(AuthHandler_class_1.Auth);
exports.authRouter
    .post('/registration', anti_clicker_middleware_1.antiClicker, userInput_validation_1.userInputValidation, errors_middleware_1.checkValidationErrors, auth.registerNewUser.bind(auth))
    .post('/registration-confirmation', anti_clicker_middleware_1.antiClicker, emailCode_validation_1.codeValidation, errors_middleware_1.checkValidationErrors, auth.registrationConfirmation.bind(auth))
    .post('/registration-email-resending', anti_clicker_middleware_1.antiClicker, emailCode_validation_1.emailValidation, errors_middleware_1.checkValidationErrors, auth.resendEmailConfirmationCode.bind(auth))
    .post('/login', anti_clicker_middleware_1.antiClicker, authInput_validation_1.inputAuthValidation, errors_middleware_1.checkValidationErrors, auth.loginUser.bind(auth))
    .post('/password-recovery', anti_clicker_middleware_1.antiClicker, emailCode_validation_1.emailValidation, errors_middleware_1.checkValidationErrors, auth.recoveryPassword.bind(auth))
    .post('/new-password', anti_clicker_middleware_1.antiClicker, passwordRecovery_validation_1.passwordRecoveryValidation, errors_middleware_1.checkValidationErrors, auth.setNewPassword.bind(auth))
    .post('/refresh-token', auth.refreshAccess.bind(auth))
    .post('/logout', auth.logoutUser.bind(auth))
    .get('/me', bearerAuthorization_1.bearerGuard, auth.getMyInfo.bind(auth));
