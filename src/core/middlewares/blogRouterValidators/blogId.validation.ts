import {param} from "express-validator";


export const blogIdValidation = param('blogId')
    .exists()
    .withMessage('BlogId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view')