"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.postIdValidation = (0, express_validator_1.param)('postId')
    .exists()
    .withMessage('PostId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view');
