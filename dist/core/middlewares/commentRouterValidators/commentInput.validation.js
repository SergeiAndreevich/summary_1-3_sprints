"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentInputValidation = void 0;
const express_validator_1 = require("express-validator");
exports.commentInputValidation = (0, express_validator_1.body)('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Content must be from 20 to 300 chars');
