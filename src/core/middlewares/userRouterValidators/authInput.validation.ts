import {body} from "express-validator";

const loginOrEmail = body('loginOrEmail')
    .exists().withMessage('loginOrEmail is required')
    .trim()
    .isString().withMessage('loginOrEmail must be string')
    .isLength({ min: 1 })
    .withMessage('It must be more than 1 symbol')

const password = body('password')
    .exists().withMessage('password is required')
    .isString()
    .trim()
    .withMessage('Password must be a string')
    .isLength({ min: 1 })
    .withMessage('Password must be greater than 1 symbol')

export const inputAuthValidation = [loginOrEmail, password]