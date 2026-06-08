import type { FieldValues } from 'react-hook-form'

import type { FormFieldRenderer } from './field-registry'

export function defaultFormFieldRenderer<TValues extends FieldValues>(
  props: Parameters<FormFieldRenderer<TValues>>[0]
) {
  return (
    <input
      aria-label={String(props.field.label ?? props.field.name)}
      {...props.input}
    />
  )
}
