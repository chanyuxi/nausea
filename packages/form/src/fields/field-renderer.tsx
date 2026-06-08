import type { FieldValues } from 'react-hook-form'

import { useOptionalFormController } from '../core/form-context'
import type { FormController } from '../core/form-controller'
import type { FormFieldSchema } from '../schema/field-schema'
import { defaultFormFieldRenderer } from './default-field-renderer'
import type { FormFieldRenderer } from './field-registry'

export interface FieldRendererProps<
  TValues extends FieldValues,
  TOutput = TValues,
> {
  controller?: FormController<TValues, TOutput>
  field: FormFieldSchema<TValues>
  renderer?: FormFieldRenderer<TValues, TOutput>
}

export function FieldRenderer<TValues extends FieldValues, TOutput = TValues>(
  props: FieldRendererProps<TValues, TOutput>
) {
  const contextController = useOptionalFormController<TValues, TOutput>()
  const controller = props.controller ?? contextController

  if (!controller) {
    throw new Error('FieldRenderer requires a FormProvider or controller prop.')
  }

  const renderer =
    props.renderer ??
    controller.renderers[props.field.render] ??
    defaultFormFieldRenderer
  const input = controller.register(props.field.name, props.field.rules)
  const value = controller.watch(props.field.name)
  const fieldState = controller.getFieldState(props.field.name)

  return renderer({
    controller,
    error: fieldState.error,
    field: props.field,
    input,
    value,
  })
}
