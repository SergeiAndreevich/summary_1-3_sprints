import {param} from "express-validator";

export const idValidation = param('id')
    .exists()
    .withMessage('CommentId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view')