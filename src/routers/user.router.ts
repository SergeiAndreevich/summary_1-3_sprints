import {Router} from "express";
import {UserHandler} from "../classes/Users/UsersHandler.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";
import {userInputValidation} from "../core/middlewares/userRouterValidators/userInput.validation";
import {idValidation} from "../core/middlewares/userRouterValidators/userId.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";


const userRouter = Router({})
const queryRepo = new QueryRepo();
const usersRepo = new UsersRepo();
const sessionsRepo = new SessionsRepo();
const usersService = new UsersService(queryRepo,usersRepo,sessionsRepo);
const userHandler = new UserHandler(usersService,queryRepo);

userRouter
    .post('/', userInputValidation,  checkValidationErrors, userHandler.createUser)
    .get('/', userHandler.getAllUsers)
    .delete('/:id', idValidation,  checkValidationErrors, userHandler.deleteSpecificUserById)