import type { OptionSource } from '../types/option-source'

export interface RegisteredOptionSource<TValue = unknown, TParams = unknown> {
  optionKey: string
  source: OptionSource<TValue, TParams>
}

export class OptionsRegistry {
  private readonly sources = new Map<string, OptionSource>()

  clear() {
    this.sources.clear()
  }

  entries(): RegisteredOptionSource[] {
    return Array.from(this.sources.entries()).map(([optionKey, source]) => ({
      optionKey,
      source,
    }))
  }

  get<TValue = unknown, TParams = unknown>(
    optionKey: string
  ): OptionSource<TValue, TParams> | undefined {
    return this.sources.get(optionKey) as
      | OptionSource<TValue, TParams>
      | undefined
  }

  has(optionKey: string): boolean {
    return this.sources.has(optionKey)
  }

  register<TValue = unknown, TParams = unknown>(
    optionKey: string,
    source: OptionSource<TValue, TParams>
  ) {
    this.sources.set(optionKey, source as OptionSource)
  }

  unregister(optionKey: string) {
    this.sources.delete(optionKey)
  }
}
