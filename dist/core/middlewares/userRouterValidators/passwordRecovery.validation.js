"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecoveryValidation = void 0;
const express_validator_1 = require("express-validator");
const recoveryCode = (0, express_validator_1.body)('recoveryCode')
    .exists()
    .withMessage('recoveryCode required')
    .isString()
    .withMessage('recoveryCode must be string');
const newPassword = (0, express_validator_1.body)('newPassword')
    .exists().withMessage('password is required')
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be greater than 6 symbols');
exports.passwordRecoveryValidation = [recoveryCode, newPassword];
