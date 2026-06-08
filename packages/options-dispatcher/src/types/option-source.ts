import type { MaybePromise, Option } from './option'

export interface OptionSourceContext<TParams = unknown> {
  optionKey: string
  params?: TParams
  signal?: AbortSignal
}

export interface StaticOptionSource<TValue = unknown> {
  options: readonly Option<TValue>[]
  type: 'static'
}

export interface RemoteOptionSource<TValue = unknown, TParams = unknown> {
  query: (
    context: OptionSourceContext<TParams>
  ) => MaybePromise<readonly Option<TValue>[]>
  type: 'remote'
}

export interface RealtimeOptionSource<TValue = unknown, TParams = unknown> {
  query: (
    context: OptionSourceContext<TParams>
  ) => MaybePromise<readonly Option<TValue>[]>
  subscribe?: (context: OptionSourceContext<TParams>) => () => void
  type: 'realtime'
}

export type OptionSource<TValue = unknown, TParams = unknown> =
  | readonly Option<TValue>[]
  | RemoteOptionSource<TValue, TParams>
  | RealtimeOptionSource<TValue, TParams>
  | StaticOptionSource<TValue>

export type NormalizedOptionSource<TValue = unknown, TParams = unknown> =
  | RemoteOptionSource<TValue, TParams>
  | RealtimeOptionSource<TValue, TParams>
  | StaticOptionSource<TValue>

function isOptionArray<TValue, TParams>(
  source: OptionSource<TValue, TParams>
): source is readonly Option<TValue>[] {
  return Array.isArray(source)
}

export function normalizeOptionSource<TValue, TParams = unknown>(
  source: OptionSource<TValue, TParams>
): NormalizedOptionSource<TValue, TParams> {
  if (isOptionArray(source)) {
    return {
      options: source,
      type: 'static',
    }
  }

  return source
}
