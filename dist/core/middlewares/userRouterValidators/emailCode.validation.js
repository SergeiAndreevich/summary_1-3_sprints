"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = exports.codeValidation = void 0;
const express_validator_1 = require("express-validator");
exports.codeValidation = (0, express_validator_1.body)('code')
    .exists()
    .withMessage('Registration confirmation code is required')
    .isString()
    .withMessage('Registration confirmation code must be string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Wrong code length');
exports.emailValidation = (0, express_validator_1.body)('email')
    .exists()
    .withMessage('Email is required')
    .isString()
    .withMessage('Email must be string')
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage('Email must be a valid email address');
