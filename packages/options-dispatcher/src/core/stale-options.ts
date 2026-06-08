import type { QueryClient } from '@tanstack/react-query'

import { createOptionsQueryKey } from '../query/query-key'

export function staleOptions<TParams = unknown>(
  queryClient: QueryClient,
  optionKey: string,
  params?: TParams
): Promise<void> {
  const queryKey =
    params === undefined
      ? createOptionsQueryKey(optionKey)
      : createOptionsQueryKey(optionKey, params)

  return queryClient.invalidateQueries({
    queryKey,
  })
}
