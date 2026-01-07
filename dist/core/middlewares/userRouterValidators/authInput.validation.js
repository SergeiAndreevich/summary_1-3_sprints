"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputAuthValidation = void 0;
const express_validator_1 = require("express-validator");
const loginOrEmail = (0, express_validator_1.body)('loginOrEmail')
    .exists().withMessage('loginOrEmail is required')
    .trim()
    .isString().withMessage('loginOrEmail must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol');
const password = (0, express_validator_1.body)('password')
    .exists().withMessage('password is required')
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 1 })
    .withMessage('Password must be greater than 1 symbol');
exports.inputAuthValidation = [loginOrEmail, password];
