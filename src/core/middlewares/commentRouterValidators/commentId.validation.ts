import {param} from "express-validator";

export const commentIdValidation = param('commentId')
    .exists()
    .withMessage('CommentId is required')
    .isString()
    .withMessage('It should be string')
    .trim()
    .isMongoId()
    .withMessage('It should be mongoId-view')