"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.deviceIdValidation = (0, express_validator_1.param)('deviceId')
    .exists().withMessage('DeviceId is required');
