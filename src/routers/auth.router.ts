import {Router} from "express";
import {Auth} from "../classes/Auth/AuthHandler.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";
import {AuthService} from "../classes/Auth/AuthService.class";
import {AuthRepo} from "../classes/Auth/AuthRepo.class";

export const authRouter = Router({});
const queryRepo = new QueryRepo();
const usersRepo = new UsersRepo();
const sessionsRepo = new SessionsRepo();
const authRepo = new AuthRepo();
const usersService = new UsersService(queryRepo, usersRepo, sessionsRepo);
const authService = new AuthService(authRepo);
const auth =  new Auth(usersService, authService);
authRouter
    .post('/registration', auth.registerNewUser)
    .post('/registration-confirmation',auth.registrationConfirmation)
    .post('/registration-email-resending',auth.resendEmailConfirmationCode)
    .post('/login', auth.loginUser)
    .post('/password-recovery', auth.recoveryPassword)
    .post('/new-password',)
    .post('/refresh-token',)
    .post('/logout',)
    .get('/me',)

