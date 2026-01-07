import {Request, Response,NextFunction} from "express";
import {FieldValidationError, ValidationError, validationResult} from "express-validator";
import {httpStatus} from "../../settings/types/httpStatuses";

//пишем middleware, которая проверяет ошибки валидации, которые насобирались
export const checkValidationErrors =
    (req:Request, res: Response, next:NextFunction) => {
        //достаем все ошибки с помощью волшебной функции validationResult(req)
        // все ошибки сложили в request на этапе валидации, а здесь их надо раскукожить и посмотреть че там
        const errors = validationResult(req)
            .formatWith(formatErrors).array({onlyFirstError: true})
        //мы наблюдаем какой-то formatWith. Че это и зачем? По умолчанию нам вернется объект Result со свойством errors и методами
        //одно из которых errors. Ошбики там в виде ValidationError, где лежит солянка из объединения типов ошибок
        if(errors.length > 0){
            //В дальнейшем здесь потребуется дистрибьюция в зависимости от ошибок
            //например, некорректный blogID - это одна ошибка, ошибка инпута - другое. и тп
            res.status(httpStatus.BadRequest).send(createErrorMessage(errors))
            return
        }
        next()
    }

export type TypeMyError = {
    message: string,
    field: string
}
function formatErrors(error: ValidationError):TypeMyError {
    const myErrorView = error as unknown as FieldValidationError; // на вход получаю ошибку ValidationError
    // преобразую её в помножество FieldValidationError, а затем достаю оттуда нужные мне свойства
    return {
        message: myErrorView.msg,
        field: myErrorView.path
    }
}

const createErrorMessage = (errors: TypeMyError[]):TypeErrorsStore => {
    return {
        errorsMessages: errors
    }
}
export type TypeErrorsStore = {
    errorsMessages: TypeMyError[]
}