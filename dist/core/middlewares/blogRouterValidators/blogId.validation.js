"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.blogIdValidation = (0, express_validator_1.param)('blogId')
    .exists()
    .withMessage('BlogId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view');
