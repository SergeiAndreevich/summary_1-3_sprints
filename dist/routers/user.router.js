"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UsersHandler_class_1 = require("../classes/Users/UsersHandler.class");
const userInput_validation_1 = require("../core/middlewares/userRouterValidators/userInput.validation");
const userId_validation_1 = require("../core/middlewares/userRouterValidators/userId.validation");
const errors_middleware_1 = require("../core/middlewares/errors.middleware");
const composition_root_1 = require("../composition-root");
exports.userRouter = (0, express_1.Router)({});
const userHandler = composition_root_1.container.get(UsersHandler_class_1.UserHandler);
exports.userRouter
    .post('/', userInput_validation_1.userInputValidation, errors_middleware_1.checkValidationErrors, userHandler.createUser)
    .get('/', userHandler.getAllUsers)
    .delete('/:id', userId_validation_1.idValidation, errors_middleware_1.checkValidationErrors, userHandler.deleteSpecificUserById);
