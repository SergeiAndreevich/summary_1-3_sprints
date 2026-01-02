import {IPAginationAndSorting, SortDirection, SortFields} from "../../settings/types/pagination.types";

const PAGE_NUMBER = 1;
const PAGE_SIZE = 10;
const SORT_BY = SortFields.createdAt;
const SORT_DIRECTION = SortDirection.DESC;

// export type TypePaginationFilter = {
//     pageNumber?: number,
//     pageSize?:  number,
//     sortBy?: string,
//     sortDirection?: string,
//     searchLoginTerm?: string | null,
//     searchNameTerm?: string | null,
//     searchEmailTerm?: string | null
// }

export function paginationHelper(filter: Partial<IPAginationAndSorting>):IPAginationAndSorting{
    return {
        pageNumber: filter.pageNumber ? Number(filter.pageNumber) : PAGE_NUMBER,
        pageSize: filter.pageSize ? Number(filter.pageSize) : PAGE_SIZE,
        sortBy: filter.sortBy ? filter.sortBy as SortFields : SORT_BY,
        sortDirection: filter.sortDirection ? filter.sortDirection as SortDirection : SORT_DIRECTION,
        searchLoginTerm: filter.searchLoginTerm ?  filter.searchLoginTerm : undefined,
        searchNameTerm: filter.searchNameTerm ? filter.searchNameTerm : undefined,
        searchEmailTerm: filter.searchEmailTerm ? filter.searchEmailTerm : undefined
    }
}

