import type { Option } from '../types/option'
import {
  useOptionsQuery,
  type UseOptionsQueryOptions,
} from './use-options-query'

export interface UseOptionsResult<TValue = unknown> {
  error: Error | null
  isError: boolean
  isLoading: boolean
  options: readonly Option<TValue>[]
  refetch: () => Promise<unknown>
}

export function useOptions<TValue = unknown, TParams = unknown>(
  options: UseOptionsQueryOptions<TValue, TParams>
): UseOptionsResult<TValue> {
  const query = useOptionsQuery(options)

  return {
    error: query.error,
    isError: query.isError,
    isLoading: query.isLoading,
    options: (query.data ?? []) as readonly Option<TValue>[],
    refetch: () => query.refetch(),
  }
}
