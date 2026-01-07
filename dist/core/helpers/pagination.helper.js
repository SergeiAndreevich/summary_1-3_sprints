"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = paginationHelper;
const pagination_types_1 = require("../../settings/types/pagination.types");
const PAGE_NUMBER = 1;
const PAGE_SIZE = 10;
const SORT_BY = pagination_types_1.SortFields.createdAt;
const SORT_DIRECTION = pagination_types_1.SortDirection.DESC;
// export type TypePaginationFilter = {
//     pageNumber?: number,
//     pageSize?:  number,
//     sortBy?: string,
//     sortDirection?: string,
//     searchLoginTerm?: string | null,
//     searchNameTerm?: string | null,
//     searchEmailTerm?: string | null
// }
function paginationHelper(filter) {
    return {
        pageNumber: filter.pageNumber ? Number(filter.pageNumber) : PAGE_NUMBER,
        pageSize: filter.pageSize ? Number(filter.pageSize) : PAGE_SIZE,
        sortBy: filter.sortBy ? filter.sortBy : SORT_BY,
        sortDirection: filter.sortDirection ? filter.sortDirection : SORT_DIRECTION,
        searchLoginTerm: filter.searchLoginTerm ? filter.searchLoginTerm : undefined,
        searchNameTerm: filter.searchNameTerm ? filter.searchNameTerm : undefined,
        searchEmailTerm: filter.searchEmailTerm ? filter.searchEmailTerm : undefined
    };
}
