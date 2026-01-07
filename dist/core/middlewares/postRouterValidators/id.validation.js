"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidation = void 0;
const express_validator_1 = require("express-validator");
exports.idValidation = (0, express_validator_1.param)('id')
    .exists()
    .withMessage('PostId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view');
