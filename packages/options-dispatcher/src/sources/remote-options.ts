import type { Option } from '../types/option'
import type {
  OptionSourceContext,
  RemoteOptionSource,
} from '../types/option-source'

export function createRemoteOptions<TValue, TParams = unknown>(
  query: (
    context: OptionSourceContext<TParams>
  ) => Promise<readonly Option<TValue>[]> | readonly Option<TValue>[]
): RemoteOptionSource<TValue, TParams> {
  return {
    query,
    type: 'remote',
  }
}
