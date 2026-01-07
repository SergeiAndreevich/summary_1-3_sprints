"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInputValidation = void 0;
const express_validator_1 = require("express-validator");
const loginValidation = (0, express_validator_1.body)('login')
    .exists()
    .withMessage('Login is required')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Login must be btw 3 and 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login must contain only letters, numbers, underscores, and hyphens');
const emailValidation = (0, express_validator_1.body)('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be string')
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage('Email must be a valid email address');
const passwordValidation = (0, express_validator_1.body)('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be btw 6 and 20 characters');
exports.userInputValidation = [loginValidation, emailValidation, passwordValidation];
