import type { FieldValues } from 'react-hook-form'

import type { FormObjectSchema } from './object-schema'

export function defineFormSchema<
  TValues extends FieldValues,
  TOutput = TValues,
>(
  schema: FormObjectSchema<TValues, TOutput>
): FormObjectSchema<TValues, TOutput> {
  return schema
}
