import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form'

import { useFormController } from '../core/form-context'
import type { FormController } from '../core/form-controller'
import type { FormFieldState } from '../fields/field-state'

export interface UseFormFieldResult<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> {
  controller: FormController<TValues>
  input: UseFormRegisterReturn<TName>
  state: FormFieldState
  value: FieldPathValue<TValues, TName>
}

export function useFormField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>(name: TName): UseFormFieldResult<TValues, TName> {
  const controller = useFormController<TValues>()
  const input = controller.register(name)
  const value = controller.watch(name)
  const state = controller.getFieldState(name)

  return {
    controller,
    input,
    state,
    value,
  }
}
