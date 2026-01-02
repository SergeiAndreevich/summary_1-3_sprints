import {param} from "express-validator";

export const postIdValidation = param('postId')
    .exists()
    .withMessage('PostId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view')