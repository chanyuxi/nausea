import type { Option } from '../types/option'
import type {
  OptionSourceContext,
  RealtimeOptionSource,
} from '../types/option-source'

export function createRealtimeOptions<TValue, TParams = unknown>(options: {
  query: (
    context: OptionSourceContext<TParams>
  ) => Promise<readonly Option<TValue>[]> | readonly Option<TValue>[]
  subscribe?: (context: OptionSourceContext<TParams>) => () => void
}): RealtimeOptionSource<TValue, TParams> {
  return {
    query: options.query,
    subscribe: options.subscribe,
    type: 'realtime',
  }
}
