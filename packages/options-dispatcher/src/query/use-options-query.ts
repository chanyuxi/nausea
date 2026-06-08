import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'

import {
  defaultOptionsDispatcher,
  type OptionsDispatcher,
} from '../core/options-dispatcher'
import type { Option } from '../types/option'
import type { OptionsQueryKey } from './query-key'
import { createOptionsQueryKey } from './query-key'

export interface UseOptionsQueryOptions<TValue = unknown, TParams = unknown> {
  dispatcher?: OptionsDispatcher
  optionKey: string
  params?: TParams
  queryOptions?: Omit<
    UseQueryOptions<
      readonly Option<TValue>[],
      Error,
      readonly Option<TValue>[],
      OptionsQueryKey<TParams>
    >,
    'queryFn' | 'queryKey'
  >
}

export function useOptionsQuery<TValue = unknown, TParams = unknown>(
  options: UseOptionsQueryOptions<TValue, TParams>
): UseQueryResult<readonly Option<TValue>[], Error> {
  const dispatcher = options.dispatcher ?? defaultOptionsDispatcher
  const queryKey =
    options.params === undefined
      ? createOptionsQueryKey<TParams>(options.optionKey)
      : createOptionsQueryKey(options.optionKey, options.params)

  return useQuery({
    ...options.queryOptions,
    queryFn({ signal }) {
      return dispatcher.resolve<TValue, TParams>({
        optionKey: options.optionKey,
        params: options.params,
        signal,
      })
    },
    queryKey,
  })
}
