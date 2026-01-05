import {body} from "express-validator";

export const codeValidation = body('code')
    .exists()