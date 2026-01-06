import {body} from "express-validator";

export const commentInputValidation = body('content')
    .exists()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 20,  max: 300 })
    .withMessage('Content must be from 20 to 300 chars')