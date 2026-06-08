import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'

import { FormControllerContext } from './form-context'
import type { FormController } from './form-controller'

export interface FormProviderProps<
  TValues extends FieldValues,
  TOutput = TValues,
> {
  children?: ReactNode
  controller: FormController<TValues, TOutput>
}

export function FormProvider<TValues extends FieldValues, TOutput = TValues>(
  props: FormProviderProps<TValues, TOutput>
) {
  return (
    <FormControllerContext.Provider
      value={props.controller as FormController<FieldValues, unknown>}
    >
      {props.children}
    </FormControllerContext.Provider>
  )
}
