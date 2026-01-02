import {Router} from "express";
import {Auth} from "../classes/Auth/AuthHandler.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";

export const authRouter = Router({});
const queryRepo = new QueryRepo();
const usersRepo = new UsersRepo();
const sessionsRepo = new SessionsRepo();
const usersService = new UsersService(queryRepo, usersRepo, sessionsRepo);
const auth =  new Auth(usersService);
authRouter
    .post('/registration', auth.registerNewUser)
    .post('/registration-confirmation',auth.registrationConfirmation)
    .post('/registration-email-resending',auth.resendEmailConfirmationCode)
    .post('/login', auth.loginUser)
    .post('/password-recovery',)
    .post('/new-password',)
    .post('/refresh-token',)
    .post('/logout',)
    .get('/me',)

