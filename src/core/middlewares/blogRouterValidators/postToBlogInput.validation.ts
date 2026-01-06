import {body} from "express-validator";

const titleValidation = body('title')
    .exists()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be string')
    .trim()
    .isLength({min:1,max: 30})
    .withMessage('Title should be less 30 characters')

const shortDescriptionValidation = body('shortDescription')
    .exists()
    .withMessage('shortDescription is required')
    .isString()
    .withMessage('shortDescription should be string')
    .trim()
    .isLength({min:1,max: 100})
    .withMessage('shortDescription should be less 30 characters')

const contentValidation = body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content should be string')
    .trim()
    .isLength({min:1,max: 1000})
    .withMessage('Content should be less 30 characters')

export const postToBlogInputValidation = [titleValidation, shortDescriptionValidation, contentValidation]