import type { DataViewResponse } from './response'

export interface DataViewPaginationState {
  pageIndex: number
  pageSize: number
}

export interface DataViewSortingRule {
  id: string
  desc: boolean
}

export type DataViewSortingState = DataViewSortingRule[]

export type DataViewFilters = Record<string, unknown>

export interface DataViewRequestParams<
  TSearch = Record<string, unknown>,
  TApi = unknown,
> {
  resourceKey: string
  api?: TApi
  search: TSearch
  pagination: DataViewPaginationState
  sorting: DataViewSortingState
  filters: DataViewFilters
  signal?: AbortSignal
}

export type MaybePromise<T> = T | Promise<T>

export type DataViewRequest<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> = (
  params: DataViewRequestParams<TSearch, TApi>
) => MaybePromise<DataViewResponse<TData>>
