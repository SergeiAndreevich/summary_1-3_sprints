import {param} from "express-validator";

export const idValidation= param('id')
    .exists()
    .withMessage('Id required')
    .isString()
    .withMessage('Id must be string')
