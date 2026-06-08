import type { OptionsQueryKey } from '../query/query-key'
import { createOptionsQueryKey } from '../query/query-key'
import type { Option } from '../types/option'
import {
  normalizeOptionSource,
  type OptionSource,
  type OptionSourceContext,
} from '../types/option-source'
import { OptionsRegistry } from './registry'

export class OptionsDispatcher {
  readonly registry: OptionsRegistry

  constructor(registry: OptionsRegistry = new OptionsRegistry()) {
    this.registry = registry
  }

  createQueryKey<TParams = unknown>(
    optionKey: string,
    params?: TParams
  ): OptionsQueryKey<TParams> {
    return params === undefined
      ? createOptionsQueryKey(optionKey)
      : createOptionsQueryKey(optionKey, params)
  }

  getSource<TValue = unknown, TParams = unknown>(optionKey: string) {
    return this.registry.get<TValue, TParams>(optionKey)
  }

  register<TValue = unknown, TParams = unknown>(
    optionKey: string,
    source: OptionSource<TValue, TParams>
  ) {
    this.registry.register(optionKey, source)

    return this
  }

  async resolve<TValue = unknown, TParams = unknown>(
    context: OptionSourceContext<TParams>
  ): Promise<readonly Option<TValue>[]> {
    const source = this.registry.get<TValue, TParams>(context.optionKey)

    if (!source) {
      throw new Error(`Option source "${context.optionKey}" is not registered.`)
    }

    const normalizedSource = normalizeOptionSource(source)

    if (normalizedSource.type === 'static') {
      return normalizedSource.options
    }

    return normalizedSource.query(context)
  }
}

export const defaultOptionsDispatcher = new OptionsDispatcher()
