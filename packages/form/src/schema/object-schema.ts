import type { DefaultValues, FieldValues } from 'react-hook-form'

import type { FormFieldSchema } from './field-schema'

export type FormValuesTransformer<
  TValues extends FieldValues,
  TOutput = TValues,
> = (values: Partial<TValues>, rawValues: TValues) => TOutput

export interface FormObjectSchema<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> {
  defaultValues?: DefaultValues<TValues>
  fields: readonly FormFieldSchema<TValues>[]
  transform?: FormValuesTransformer<TValues, TOutput>
}
