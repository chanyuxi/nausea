import type { FieldValues } from 'react-hook-form'

import type { FormFieldSchema } from '../schema/field-schema'
import type { FormFieldRenderer } from './field-registry'
import { FieldRenderer } from './field-renderer'

export interface FieldControllerProps<
  TValues extends FieldValues,
  TOutput = TValues,
> {
  field: FormFieldSchema<TValues>
  renderer?: FormFieldRenderer<TValues, TOutput>
}

export function FieldController<TValues extends FieldValues, TOutput = TValues>(
  props: FieldControllerProps<TValues, TOutput>
) {
  return (
    <FieldRenderer
      field={props.field}
      renderer={props.renderer}
    />
  )
}
