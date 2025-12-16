import {httpStatus} from "./httpStatuses";
import {TypeErrorView} from "./error.types";

export interface IResult<T=null>{
    data: T,
    status: httpStatus,
    error?: TypeErrorView
}