import {param} from "express-validator";

export const deviceIdValidation = param('deviceId')
    .exists().withMessage('DeviceId is required')