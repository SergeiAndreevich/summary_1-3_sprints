import {body} from "express-validator";

const recoveryCode = body('recoveryCode')
    .exists()
    .withMessage('recoveryCode required')
    .isString()
    .withMessage('recoveryCode must be string')


const newPassword = body('newPassword')
    .exists().withMessage('password is required')
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be greater than 6 symbols')

export const passwordRecoveryValidation = [recoveryCode, newPassword]