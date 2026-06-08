import { useCallback, useMemo, useState } from 'react'

import type { UseDataViewQueryOptions } from '../query/use-data-view-query'
import { useDataViewQuery } from '../query/use-data-view-query'
import type { DataViewRequest, DataViewRequestParams } from '../types/request'
import type { DataViewActions } from './data-view-actions'
import {
  createDataViewInitialState,
  type DataViewState,
  DEFAULT_DATA_VIEW_PAGE_INDEX,
} from './data-view-state'

export interface CreateDataViewControllerOptions<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> {
  resourceKey: string
  api?: TApi
  request?: DataViewRequest<TData, TSearch, TApi>
  configRequest?: DataViewRequest<unknown, Record<string, unknown>, TApi>
  defaultSearch?: Partial<TSearch>
  defaultPagination?: Partial<DataViewState<TSearch>['pagination']>
  queryOptions?: UseDataViewQueryOptions<TData, TSearch, TApi>['queryOptions']
}

export interface DataViewController<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
> {
  state: DataViewState<TSearch>
  actions: DataViewActions<TSearch>
  requestParams: DataViewRequestParams<TSearch, TApi>
  query: ReturnType<typeof useDataViewQuery<TData, TSearch, TApi>>
}

export function resolveDataViewRequest<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(
  request?: DataViewRequest<TData, TSearch, TApi>,
  configRequest?: DataViewRequest<unknown, Record<string, unknown>, TApi>
): DataViewRequest<TData, TSearch, TApi> | undefined {
  // Global config intentionally stays unbound to page generics. The page-level
  // request wins, and the fallback is trusted to normalize by runtime response.
  return (
    request ??
    (configRequest as DataViewRequest<TData, TSearch, TApi> | undefined)
  )
}

export function createDataViewRequestParams<
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(
  options: Pick<
    CreateDataViewControllerOptions<unknown, TSearch, TApi>,
    'api'
  > &
    Pick<DataViewRequestParams<TSearch, TApi>, 'resourceKey'>,
  state: DataViewState<TSearch>
): DataViewRequestParams<TSearch, TApi> {
  return {
    resourceKey: options.resourceKey,
    api: options.api,
    search: state.search,
    pagination: state.pagination,
    sorting: state.sorting,
    filters: state.filters,
  }
}

export function useCreateDataViewController<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(
  options: CreateDataViewControllerOptions<TData, TSearch, TApi>
): DataViewController<TData, TSearch, TApi> {
  const initialState = useMemo(
    () =>
      createDataViewInitialState<TSearch>({
        defaultSearch: options.defaultSearch,
        defaultPagination: options.defaultPagination,
      }),
    [options.defaultPagination, options.defaultSearch]
  )
  const [state, setState] = useState(initialState)
  const request = resolveDataViewRequest(options.request, options.configRequest)
  const requestParams = useMemo(
    () =>
      createDataViewRequestParams(
        {
          api: options.api,
          resourceKey: options.resourceKey,
        },
        state
      ),
    [options.api, options.resourceKey, state]
  )
  const queryOptions = useMemo(() => {
    if (request) {
      return options.queryOptions
    }

    // A missing request should not immediately throw during layout work. The
    // explicit request assertion still runs once a query is enabled.
    return {
      ...options.queryOptions,
      enabled: false,
    }
  }, [options.queryOptions, request])
  const query = useDataViewQuery<TData, TSearch, TApi>({
    request,
    params: requestParams,
    queryOptions,
  })

  const resetToFirstPage = useCallback(
    (nextState: DataViewState<TSearch>): DataViewState<TSearch> => ({
      ...nextState,
      pagination: {
        ...nextState.pagination,
        pageIndex: DEFAULT_DATA_VIEW_PAGE_INDEX,
      },
    }),
    []
  )

  const actions = useMemo<DataViewActions<TSearch>>(
    () => ({
      setSearch(search) {
        setState((current) =>
          resetToFirstPage({
            ...current,
            search,
          })
        )
      },
      submitSearch(search) {
        setState((current) =>
          resetToFirstPage({
            ...current,
            search: search ?? current.search,
          })
        )
      },
      resetSearch() {
        setState(
          createDataViewInitialState<TSearch>({
            defaultSearch: options.defaultSearch,
            defaultPagination: options.defaultPagination,
          })
        )
      },
      setPageIndex(pageIndex) {
        setState((current) => ({
          ...current,
          pagination: {
            ...current.pagination,
            pageIndex,
          },
        }))
      },
      setPageSize(pageSize) {
        setState((current) =>
          resetToFirstPage({
            ...current,
            pagination: {
              ...current.pagination,
              pageSize,
            },
          })
        )
      },
      setPagination(pagination) {
        setState((current) => ({
          ...current,
          pagination,
        }))
      },
      setSorting(sorting) {
        setState((current) =>
          resetToFirstPage({
            ...current,
            sorting,
          })
        )
      },
      setFilters(filters) {
        setState((current) =>
          resetToFirstPage({
            ...current,
            filters,
          })
        )
      },
      refresh() {
        void query.refetch()
      },
    }),
    [options.defaultPagination, options.defaultSearch, query, resetToFirstPage]
  )

  return {
    state,
    actions,
    requestParams,
    query,
  }
}
