import type { FieldValues } from 'react-hook-form'

import type { FormController, FormSubmitHandler } from '../core/form-controller'

export function submitForm<TValues extends FieldValues, TOutput = TValues>(
  controller: FormController<TValues, TOutput>,
  handler?: FormSubmitHandler<TValues, TOutput>
) {
  return controller.submit(handler)
}
