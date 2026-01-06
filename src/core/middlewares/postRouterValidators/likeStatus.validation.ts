import {body} from "express-validator";

export const likeStatusValidation = body('LikeStatus')
    .exists().withMessage('Like status is required')
    .trim()