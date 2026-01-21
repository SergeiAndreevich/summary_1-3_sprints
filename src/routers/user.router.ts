import {Router} from "express";
import {UserHandler} from "../classes/Users/UsersHandler.class";
import {QueryRepo} from "../classes/QueryRepo.class";
import {UsersService} from "../classes/Users/UsersService.class";
import {UsersRepo} from "../classes/Users/UsersRepo.class";
import {SessionsRepo} from "../classes/Session/SessionsRepo.class";
import {userInputValidation} from "../core/middlewares/userRouterValidators/userInput.validation";
import {idValidation} from "../core/middlewares/userRouterValidators/userId.validation";
import {checkValidationErrors} from "../core/middlewares/errors.middleware";
import {container} from "../composition-root";


export const userRouter = Router({})
const userHandler = container.get(UserHandler);

userRouter
    .post('/', userInputValidation,  checkValidationErrors, userHandler.createUser)
    .get('/', userHandler.getAllUsers)
    .delete('/:id', idValidation,  checkValidationErrors, userHandler.deleteSpecificUserById)