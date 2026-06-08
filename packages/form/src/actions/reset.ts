import type { DefaultValues, FieldValues } from 'react-hook-form'

import type { FormController } from '../core/form-controller'

export function resetForm<TValues extends FieldValues, TOutput = TValues>(
  controller: FormController<TValues, TOutput>,
  values?: DefaultValues<TValues> | TValues
) {
  controller.reset(values)
}
