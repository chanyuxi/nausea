import type { FormOptions } from './option-types'

export interface FormOptionFieldConfig<TValue = unknown> {
  optionKey?: string
  options?: FormOptions<TValue>
}
