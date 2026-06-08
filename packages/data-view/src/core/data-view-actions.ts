import type {
  DataViewFilters,
  DataViewPaginationState,
  DataViewSortingState,
} from '../types/request'

export interface DataViewActions<TSearch = Record<string, unknown>> {
  setSearch: (search: TSearch) => void
  submitSearch: (search?: TSearch) => void
  resetSearch: () => void
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  setPagination: (pagination: DataViewPaginationState) => void
  setSorting: (sorting: DataViewSortingState) => void
  setFilters: (filters: DataViewFilters) => void
  refresh: () => void
}
