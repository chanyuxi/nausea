import { createContext, useContext } from 'react'
import type { FieldValues } from 'react-hook-form'

import type { FormController } from './form-controller'

export const FormControllerContext = createContext<FormController<
  FieldValues,
  unknown
> | null>(null)

export function useFormController<
  TValues extends FieldValues,
  TOutput = TValues,
>(): FormController<TValues, TOutput> {
  const controller = useOptionalFormController<TValues, TOutput>()

  if (!controller) {
    throw new Error('useFormController must be used within FormProvider.')
  }

  return controller
}

export function useOptionalFormController<
  TValues extends FieldValues,
  TOutput = TValues,
>(): FormController<TValues, TOutput> | null {
  const controller = useContext(FormControllerContext)

  if (!controller) {
    return null
  }

  // React context stores one erased controller shape. The public hook restores
  // the page-level generic chosen by the caller.
  return controller as FormController<TValues, TOutput>
}
