import type { Option } from '../types/option'
import type { StaticOptionSource } from '../types/option-source'

export function createStaticOptions<TValue>(
  options: readonly Option<TValue>[]
): StaticOptionSource<TValue> {
  return {
    options,
    type: 'static',
  }
}
