"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersHandler_class_1 = require("../classes/Users/UsersHandler.class");
const QueryRepo_class_1 = require("../classes/QueryRepo.class");
const UsersService_class_1 = require("../classes/Users/UsersService.class");
const UsersRepo_class_1 = require("../classes/Users/UsersRepo.class");
const SessionsRepo_class_1 = require("../classes/Session/SessionsRepo.class");
const userInput_validation_1 = require("../core/middlewares/userRouterValidators/userInput.validation");
const userId_validation_1 = require("../core/middlewares/userRouterValidators/userId.validation");
const userRouter = (0, express_1.Router)({});
const queryRepo = new QueryRepo_class_1.QueryRepo();
const usersRepo = new UsersRepo_class_1.UsersRepo();
const sessionsRepo = new SessionsRepo_class_1.SessionsRepo();
const usersService = new UsersService_class_1.UsersService(queryRepo, usersRepo, sessionsRepo);
const userHandler = new UsersHandler_class_1.UserHandler(usersService, queryRepo);
userRouter
    .post('/', userInput_validation_1.userInputValidation, userHandler.createUser)
    .get('/', userHandler.getAllUsers)
    .delete('/:id', userId_validation_1.idValidation, userHandler.deleteSpecificUserById);
