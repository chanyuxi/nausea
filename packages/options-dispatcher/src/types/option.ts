export interface Option<TValue = unknown> {
  disabled?: boolean
  label: string
  meta?: Record<string, unknown>
  value: TValue
}

export type Options<TValue = unknown> = readonly Option<TValue>[]

export type MaybePromise<T> = T | Promise<T>
