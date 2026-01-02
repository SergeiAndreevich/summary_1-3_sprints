import {Router} from "express";
import {UserHandler} from "../classes/Users/UsersHandler.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";


const userRouter = Router({})
const queryRepo = new QueryRepo();
const usersRepo = new UsersRepo();
const sessionsRepo = new SessionsRepo();
const usersService = new UsersService(queryRepo,usersRepo,sessionsRepo);
const userHandler = new UserHandler(usersService,queryRepo);

userRouter
    .post('/', userHandler.createUser)
    .get('/', userHandler.getAllUsers)
    .delete('/:id', userHandler.deleteSpecificUserById)