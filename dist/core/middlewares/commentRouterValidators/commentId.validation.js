"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.commentIdValidation = (0, express_validator_1.param)('commentId')
    .exists()
    .withMessage('CommentId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view');
