"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UsersHandler_class_1 = require("../classes/Users/UsersHandler.class");
const QueryRepo_class_1 = require("../classes/QueryRepo.class");
const UsersService_class_1 = require("../classes/Users/UsersService.class");
const UsersRepo_class_1 = require("../classes/Users/UsersRepo.class");
const SessionsRepo_class_1 = require("../classes/Session/SessionsRepo.class");
const userInput_validation_1 = require("../core/middlewares/userRouterValidators/userInput.validation");
const userId_validation_1 = require("../core/middlewares/userRouterValidators/userId.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
exports.userRouter = (0, express_1.Router)({});
const queryRepo = new QueryRepo_class_1.QueryRepo();
const usersRepo = new UsersRepo_class_1.UsersRepo();
const sessionsRepo = new SessionsRepo_class_1.SessionsRepo();
const usersService = new UsersService_class_1.UsersService(queryRepo, usersRepo, sessionsRepo);
const userHandler = new UsersHandler_class_1.UserHandler(usersService, queryRepo);
exports.userRouter
    .post('/', userInput_validation_1.userInputValidation, errors_middleware_1.checkValidationErrors, userHandler.createUser)
    .get('/', userHandler.getAllUsers)
    .delete('/:id', userId_validation_1.idValidation, errors_middleware_1.checkValidationErrors, userHandler.deleteSpecificUserById);
