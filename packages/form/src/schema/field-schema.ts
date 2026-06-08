import type { ReactNode } from 'react'
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'

import type { FormOptionFieldConfig } from '../options/option-field'

export type FormFieldValueTransformer<
  TValues extends FieldValues,
  TValue = unknown,
> = (value: TValue, values: TValues) => unknown

export interface FormFieldSchema<
  TValues extends FieldValues = FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>,
> extends FormOptionFieldConfig {
  defaultValue?: unknown
  label?: ReactNode
  name: TName
  props?: Record<string, unknown>
  render: string
  rules?: RegisterOptions<TValues, TName>
  transform?: FormFieldValueTransformer<TValues>
}
