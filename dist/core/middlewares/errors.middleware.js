"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const httpStatuses_1 = require("../../settings/types/httpStatuses");
//пишем middleware, которая проверяет ошибки валидации, которые насобирались
const checkValidationErrors = (req, res, next) => {
    //достаем все ошибки с помощью волшебной функции validationResult(req)
    // все ошибки сложили в request на этапе валидации, а здесь их надо раскукожить и посмотреть че там
    const errors = (0, express_validator_1.validationResult)(req)
        .formatWith(formatErrors).array({ onlyFirstError: true });
    //мы наблюдаем какой-то formatWith. Че это и зачем? По умолчанию нам вернется объект Result со свойством errors и методами
    //одно из которых errors. Ошбики там в виде ValidationError, где лежит солянка из объединения типов ошибок
    if (errors.length > 0) {
        //В дальнейшем здесь потребуется дистрибьюция в зависимости от ошибок
        //например, некорректный blogID - это одна ошибка, ошибка инпута - другое. и тп
        res.status(httpStatuses_1.httpStatus.BadRequest).send(createErrorMessage(errors));
        return;
    }
    next();
};
exports.checkValidationErrors = checkValidationErrors;
function formatErrors(error) {
    const myErrorView = error; // на вход получаю ошибку ValidationError
    // преобразую её в помножество FieldValidationError, а затем достаю оттуда нужные мне свойства
    return {
        message: myErrorView.msg,
        field: myErrorView.path
    };
}
const createErrorMessage = (errors) => {
    return {
        errorsMessages: errors
    };
};
