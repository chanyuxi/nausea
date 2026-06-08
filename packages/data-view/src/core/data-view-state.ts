import type {
  DataViewFilters,
  DataViewPaginationState,
  DataViewSortingState,
} from '../types/request'

export const DEFAULT_DATA_VIEW_PAGE_INDEX = 0
export const DEFAULT_DATA_VIEW_PAGE_SIZE = 20

export interface DataViewState<TSearch = Record<string, unknown>> {
  search: TSearch
  pagination: DataViewPaginationState
  sorting: DataViewSortingState
  filters: DataViewFilters
}

export interface CreateDataViewInitialStateOptions<TSearch> {
  defaultSearch?: Partial<TSearch>
  defaultPagination?: Partial<DataViewPaginationState>
  defaultSorting?: DataViewSortingState
  defaultFilters?: DataViewFilters
}

export function createDataViewInitialState<TSearch = Record<string, unknown>>(
  options: CreateDataViewInitialStateOptions<TSearch> = {}
): DataViewState<TSearch> {
  return {
    // Search values are user-defined. The cast keeps DataView generic while
    // allowing pages to start from a partial set of defaults.
    search: (options.defaultSearch ?? {}) as TSearch,
    pagination: {
      pageIndex:
        options.defaultPagination?.pageIndex ?? DEFAULT_DATA_VIEW_PAGE_INDEX,
      pageSize:
        options.defaultPagination?.pageSize ?? DEFAULT_DATA_VIEW_PAGE_SIZE,
    },
    sorting: options.defaultSorting ?? [],
    filters: options.defaultFilters ?? {},
  }
}
