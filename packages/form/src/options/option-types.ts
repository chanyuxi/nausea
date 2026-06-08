import type { ReactNode } from 'react'

export interface FormOption<TValue = unknown> {
  disabled?: boolean
  label: ReactNode
  meta?: Record<string, unknown>
  value: TValue
}

export type FormOptions<TValue = unknown> = readonly FormOption<TValue>[]
