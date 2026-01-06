import {body} from "express-validator";

const nameValidation = body('name')
    .exists()
    .withMessage('name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Length must be less than 15 characters');
const descriptionValidation = body('description')
    .exists()
    .withMessage('description is required')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Length of description must be less then 500');
const websiteUrlValidation = body('websiteUrl')
    .exists()
    .withMessage('url is required')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length of url must be >10 and <100')
    .isURL()
    .withMessage('It should be url');

export const blogInputValidation = [nameValidation, descriptionValidation, websiteUrlValidation];