import type { DefaultValues, FieldValues } from 'react-hook-form'

import type { FormFieldSchema } from './field-schema'
import type { FormObjectSchema } from './object-schema'

export interface NormalizedFormSchema<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> extends FormObjectSchema<TValues, TOutput> {
  defaultValues: DefaultValues<TValues>
  fields: readonly FormFieldSchema<TValues>[]
}

export function normalizeFormSchema<
  TValues extends FieldValues,
  TOutput = TValues,
>(
  schema: FormObjectSchema<TValues, TOutput>
): NormalizedFormSchema<TValues, TOutput> {
  return {
    ...schema,
    defaultValues: (schema.defaultValues ?? {}) as DefaultValues<TValues>,
    fields: schema.fields ?? [],
  }
}
