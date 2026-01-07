"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputValidation = void 0;
const express_validator_1 = require("express-validator");
const nameValidation = (0, express_validator_1.body)('name')
    .exists()
    .withMessage('name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Length must be less than 15 characters');
const descriptionValidation = (0, express_validator_1.body)('description')
    .exists()
    .withMessage('description is required')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Length of description must be less then 500');
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .exists()
    .withMessage('url is required')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length of url must be >10 and <100')
    .isURL()
    .withMessage('It should be url');
exports.blogInputValidation = [nameValidation, descriptionValidation, websiteUrlValidation];
