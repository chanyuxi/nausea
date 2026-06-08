export const OPTIONS_QUERY_KEY_PREFIX = 'nausea:options'

export type OptionsQueryKey<TParams = unknown> =
  | readonly [typeof OPTIONS_QUERY_KEY_PREFIX, string]
  | readonly [typeof OPTIONS_QUERY_KEY_PREFIX, string, TParams]

export function createOptionsQueryKey<TParams = unknown>(
  optionKey: string
): OptionsQueryKey<TParams>
export function createOptionsQueryKey<TParams = unknown>(
  optionKey: string,
  params: TParams
): OptionsQueryKey<TParams>
export function createOptionsQueryKey<TParams = unknown>(
  optionKey: string,
  params?: TParams
): OptionsQueryKey<TParams> {
  // Keep the no-param key short so staleOptions(optionKey) can invalidate all
  // param variants through TanStack Query's partial key matching.
  if (params === undefined) {
    return [OPTIONS_QUERY_KEY_PREFIX, optionKey] as const
  }

  return [OPTIONS_QUERY_KEY_PREFIX, optionKey, params] as const
}
