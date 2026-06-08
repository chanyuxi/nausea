import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import type { DataViewRequest, DataViewRequestParams } from '../types/request'
import type { DataViewResponse } from '../types/response'
import type { DataViewQueryKey } from './data-view-query-key'
import { createDataViewQueryKey } from './data-view-query-key'
import { executeDataViewRequest } from './data-view-request'

export interface UseDataViewQueryOptions<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
  TSelected = DataViewResponse<TData>,
  TError = Error,
> {
  request?: DataViewRequest<TData, TSearch, TApi>
  params: DataViewRequestParams<TSearch, TApi>
  queryOptions?: Omit<
    UseQueryOptions<
      DataViewResponse<TData>,
      TError,
      TSelected,
      DataViewQueryKey<TSearch, TApi>
    >,
    'queryFn' | 'queryKey'
  >
}

export function useDataViewQuery<
  TData,
  TSearch = Record<string, unknown>,
  TApi = unknown,
  TSelected = DataViewResponse<TData>,
  TError = Error,
>(
  options: UseDataViewQueryOptions<TData, TSearch, TApi, TSelected, TError>
): UseQueryResult<TSelected, TError> {
  const queryKey = createDataViewQueryKey(options.params)

  return useQuery<
    DataViewResponse<TData>,
    TError,
    TSelected,
    DataViewQueryKey<TSearch, TApi>
  >({
    ...options.queryOptions,
    queryKey,
    queryFn: ({ signal }) =>
      // React Query owns cancellation. DataView forwards that signal into the
      // user request while preserving the caller's original params object.
      executeDataViewRequest(options.request, {
        ...options.params,
        signal,
      }),
  })
}
