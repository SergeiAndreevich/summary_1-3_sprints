"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToBlogInputValidation = void 0;
const express_validator_1 = require("express-validator");
const titleValidation = (0, express_validator_1.body)('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title should be less 30 characters');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage('shortDescription should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('shortDescription should be less 30 characters');
const contentValidation = (0, express_validator_1.body)('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content should be string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content should be less 30 characters');
exports.postToBlogInputValidation = [titleValidation, shortDescriptionValidation, contentValidation];
