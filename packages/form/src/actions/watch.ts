import type { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form'

import type { FormController } from '../core/form-controller'

export function watchForm<TValues extends FieldValues>(
  controller: FormController<TValues>
): TValues {
  return controller.watch()
}

export function watchFormField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>(
  controller: FormController<TValues>,
  name: TName
): FieldPathValue<TValues, TName> {
  return controller.watch(name)
}
