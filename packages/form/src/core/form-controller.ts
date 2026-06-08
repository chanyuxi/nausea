import type {
  DefaultValues,
  FieldError,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  SetValueConfig,
  UseFormRegisterReturn,
} from 'react-hook-form'

import type { FormFieldRendererRegistry } from '../fields/field-registry'
import type { NormalizedFormSchema } from '../schema/normalize-schema'

export type FormSubmitHandler<
  TValues extends FieldValues,
  TOutput = TValues,
> = (values: TOutput, rawValues: TValues) => unknown | Promise<unknown>

export interface FormController<
  TValues extends FieldValues = FieldValues,
  TOutput = TValues,
> {
  defaultValues: DefaultValues<TValues>
  fields: NormalizedFormSchema<TValues, TOutput>['fields']
  getFieldState: <TName extends FieldPath<TValues>>(
    name: TName
  ) => FormControllerFieldState
  getValues: () => TValues
  register: <TName extends FieldPath<TValues>>(
    name: TName,
    rules?: RegisterOptions<TValues, TName>
  ) => UseFormRegisterReturn<TName>
  renderers: FormFieldRendererRegistry<TValues, TOutput>
  reset: (values?: DefaultValues<TValues> | TValues) => void
  schema: NormalizedFormSchema<TValues, TOutput>
  setValue: <TName extends FieldPath<TValues>>(
    name: TName,
    value: FieldPathValue<TValues, TName>,
    options?: SetValueConfig
  ) => void
  submit: (handler?: FormSubmitHandler<TValues, TOutput>) => Promise<void>
  transformValues: (values?: TValues) => TOutput
  watch: {
    (): TValues
    <TName extends FieldPath<TValues>>(
      name: TName
    ): FieldPathValue<TValues, TName>
  }
}

export interface FormControllerFieldState {
  error?: FieldError
  invalid: boolean
  isDirty: boolean
  isTouched: boolean
  isValidating: boolean
}
