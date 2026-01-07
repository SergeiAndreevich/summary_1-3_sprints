"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeStatusValidation = void 0;
const express_validator_1 = require("express-validator");
exports.likeStatusValidation = (0, express_validator_1.body)('LikeStatus')
    .exists().withMessage('Like status is required')
    .trim();
