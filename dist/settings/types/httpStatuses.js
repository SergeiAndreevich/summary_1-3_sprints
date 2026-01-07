"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatus = void 0;
var httpStatus;
(function (httpStatus) {
    httpStatus[httpStatus["Ok"] = 200] = "Ok";
    httpStatus[httpStatus["Created"] = 201] = "Created";
    httpStatus[httpStatus["NoContent"] = 204] = "NoContent";
    httpStatus[httpStatus["BadRequest"] = 400] = "BadRequest";
    httpStatus[httpStatus["Unauthorized"] = 401] = "Unauthorized";
    httpStatus[httpStatus["Forbidden"] = 403] = "Forbidden";
    httpStatus[httpStatus["NotFound"] = 404] = "NotFound";
    httpStatus[httpStatus["TooManyRequests"] = 429] = "TooManyRequests";
    httpStatus[httpStatus["InternalServerError"] = 500] = "InternalServerError";
    httpStatus[httpStatus["ExtraError"] = 600] = "ExtraError";
})(httpStatus || (exports.httpStatus = httpStatus = {}));
