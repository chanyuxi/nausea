export {
  defaultOptionsDispatcher,
  OptionsDispatcher,
} from './core/options-dispatcher'
export type { RegisteredOptionSource } from './core/registry'
export { OptionsRegistry } from './core/registry'
export { staleOptions } from './core/stale-options'
export {
  createOptionsQueryKey,
  OPTIONS_QUERY_KEY_PREFIX,
  type OptionsQueryKey,
} from './query/query-key'
export { useOptions, type UseOptionsResult } from './query/use-options'
export {
  useOptionsQuery,
  type UseOptionsQueryOptions,
} from './query/use-options-query'
export { createRealtimeOptions } from './sources/realtime-options'
export { createRemoteOptions } from './sources/remote-options'
export { createStaticOptions } from './sources/static-options'
export type { MaybePromise, Option, Options } from './types'
export {
  type NormalizedOptionSource,
  normalizeOptionSource,
  type OptionSource,
  type OptionSourceContext,
  type RealtimeOptionSource,
  type RemoteOptionSource,
  type StaticOptionSource,
} from './types'
