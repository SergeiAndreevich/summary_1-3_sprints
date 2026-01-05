// login: string
// password: string
// email: string

import { body } from "express-validator";

const login = body('login')
    .exists()

const password = body('password')
    .exists()

const email = body('email')
    .exists()

export const userInputValidation = [login, password, email];