import type { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form'

import type { FormController } from '../core/form-controller'

export function getFormValues<TValues extends FieldValues>(
  controller: FormController<TValues>
) {
  return controller.getValues()
}

export function setFormValue<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>(
  controller: FormController<TValues>,
  name: TName,
  value: FieldPathValue<TValues, TName>
) {
  controller.setValue(name, value)
}
