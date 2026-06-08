import type { FieldValues } from 'react-hook-form'

import type { NormalizedFormSchema } from '../schema/normalize-schema'
import { cleanupEmptyValues } from './cleanup-empty-values'

export function transformFormValues<
  TValues extends FieldValues,
  TOutput = TValues,
>(schema: NormalizedFormSchema<TValues, TOutput>, values: TValues): TOutput {
  const nextValues: Partial<TValues> = {
    ...values,
  }

  for (const field of schema.fields) {
    if (!field.transform) {
      continue
    }

    const fieldName = field.name as keyof TValues
    nextValues[fieldName] = field.transform(
      values[fieldName],
      values
    ) as TValues[keyof TValues]
  }

  const cleanedValues = cleanupEmptyValues(nextValues)

  if (schema.transform) {
    return schema.transform(cleanedValues, values)
  }

  return cleanedValues as TOutput
}
