import {httpStatus} from "./httpStatuses";

export interface IResult<T=null>{
    data: T,
    status: httpStatus,
    error?: TypeError
}