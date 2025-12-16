import {Router} from "express";
import {Auth} from "../classes/Auth/AuthHandler.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";

export const authRouter = Router({});
const queryRepo = new QueryRepo();
const usersRepo = new UsersRepo();
const usersService = new UsersService(queryRepo, usersRepo);
const auth =  new Auth(usersService);
authRouter
    .post('/registration', auth.registerNewUserHandler)
    .post('/registration-confirmation',)
    .post('/registration-email-resending',)
    .post('/login', )
    .post('/password-recovery',)
    .post('/new-password',)
    .post('/refresh-token',)
    .post('/logout',)
    .get('/me',)

