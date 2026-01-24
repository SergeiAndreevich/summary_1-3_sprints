import {body} from "express-validator";

export const likeStatusValidation = body('likeStatus')
    .exists().withMessage('Like status is required')
    .isIn(['Like', 'Dislike', 'None'])
    .withMessage('Invalid like status');