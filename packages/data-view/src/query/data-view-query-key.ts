import type { DataViewRequestParams } from '../types/request'

export const DATA_VIEW_QUERY_KEY_PREFIX = 'nausea:data-view' as const

export type DataViewQueryKey<
  TSearch = Record<string, unknown>,
  TApi = unknown,
> = readonly [
  typeof DATA_VIEW_QUERY_KEY_PREFIX,
  string,
  TApi | undefined,
  TSearch,
  DataViewRequestParams<TSearch, TApi>['pagination'],
  DataViewRequestParams<TSearch, TApi>['sorting'],
  DataViewRequestParams<TSearch, TApi>['filters'],
]

export function createDataViewQueryKey<
  TSearch = Record<string, unknown>,
  TApi = unknown,
>(
  params: Pick<
    DataViewRequestParams<TSearch, TApi>,
    'api' | 'filters' | 'pagination' | 'resourceKey' | 'search' | 'sorting'
  >
): DataViewQueryKey<TSearch, TApi> {
  return [
    DATA_VIEW_QUERY_KEY_PREFIX,
    params.resourceKey,
    params.api,
    params.search,
    params.pagination,
    params.sorting,
    params.filters,
  ] as const
}
